import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


// Use MixinStorage for blob storage capabilities.

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Post = {
    id : Nat;
    content : Text;
    authorYear : Text;
    category : Category;
    upvotes : Nat;
    connectCount : Nat;
    createdAt : Int;
  };

  type Category = {
    #internships;
    #hackathons;
    #courses;
    #general;
  };

  type PostStats = {
    totalPosts : Nat;
    categoryCounts : [(Category, Nat)];
    topUpvotedPosts : [Post];
    topConnectedPosts : [Post];
  };

  type Wishlist = {
    sessionKey : Text;
    postIds : [Nat];
  };

  type CollegeConnect = {
    id : Nat;
    collegeName : Text;
    year : Text;
    tip : Text;
    createdAt : Int;
  };

  module Post {
    public func compareByUpvotes(post1 : Post, post2 : Post) : Order.Order {
      if (post1.upvotes > post2.upvotes) {
        #less;
      } else if (post1.upvotes < post2.upvotes) {
        #greater;
      } else { #equal };
    };

    public func compareByConnects(post1 : Post, post2 : Post) : Order.Order {
      if (post1.connectCount > post2.connectCount) {
        #less;
      } else if (post1.connectCount < post2.connectCount) {
        #greater;
      } else { #equal };
    };
  };

  var nextPostId = 0;
  let posts = Map.empty<Nat, Post>();

  var nextCollegeConnectId = 0;
  let collegeConnects = Map.empty<Nat, CollegeConnect>();
  let wishlists = Map.empty<Text, [Nat]>();

  // User Profile (required by instructions)
  type UserProfile = {
    name : Text;
    collegeYear : Text;
    collegeName : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Student Profiles and DM System
  type StudentProfile = {
    name : Text;
    collegeYear : Text;
    collegeName : Text;
    availableForDM : Bool;
  };

  let studentProfiles = Map.empty<Text, StudentProfile>();

  type DMMessage = {
    sender : Text;
    recipient : Text;
    message : Text;
    timestamp : Int;
  };

  let dmMessages = Map.empty<Text, [DMMessage]>();

  // Chat Message Board
  type ChatMessage = {
    authorName : Text;
    collegeYear : Text;
    message : Text;
    timestamp : Int;
  };

  let chatMessages = List.empty<ChatMessage>();

  // Feedback System
  type FeedbackEntry = {
    authorName : Text;
    collegeYear : Text;
    feedback : Text;
    timestamp : Int;
  };

  let feedbackEntries = List.empty<FeedbackEntry>();

  // Methods for original backend features
  public shared ({ caller }) func createPost(
    content : Text,
    authorYear : Text,
    category : Category,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };
    let postId = nextPostId;
    let post : Post = {
      id = postId;
      content;
      authorYear;
      category;
      upvotes = 0;
      connectCount = 0;
      createdAt = Time.now();
    };
    posts.add(postId, post);
    nextPostId += 1;
    postId;
  };

  public query func getAllPosts() : async [Post] {
    posts.values().toArray();
  };

  public query func getPostsByCategory(category : Category) : async [Post] {
    posts.values().toArray().filter(
      func(p) {
        p.category == category;
      }
    );
  };

  public query func getStats() : async PostStats {
    let allPostsArray = posts.values().toArray();

    // Calculate category counts
    let categoryCounts = [(#internships, 0), (#hackathons, 0), (#courses, 0), (#general, 0)];
    let updatedCategoryCounts = allPostsArray.foldLeft(
      categoryCounts,
      func(currentCounts, post) {
        currentCounts.map(
          func((cat, count)) {
            if (cat == post.category) {
              (cat, count + 1);
            } else { (cat, count) };
          }
        );
      },
    );

    // Top 5 by upvotes
    let sortedByUpvotes = allPostsArray.sort(Post.compareByUpvotes);
    let topUpvoted = sortedByUpvotes.sliceToArray(0, Nat.min(sortedByUpvotes.size(), 5));

    // Top 5 by connects
    let sortedByConnects = allPostsArray.sort(Post.compareByConnects);
    let topConnected = sortedByConnects.sliceToArray(0, Nat.min(sortedByConnects.size(), 5));

    {
      totalPosts = allPostsArray.size();
      categoryCounts = updatedCategoryCounts;
      topUpvotedPosts = topUpvoted;
      topConnectedPosts = topConnected;
    };
  };

  // Wishlist functions
  public shared ({ caller }) func addToWishlist(sessionKey : Text, postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage wishlists");
    };
    let currentWishlist = switch (wishlists.get(sessionKey)) {
      case (null) { [] };
      case (?wishlist) { wishlist };
    };

    let postExists = posts.containsKey(postId);
    if (not postExists) {
      Runtime.trap("Post does not exist, cannot add to wishlist");
    };

    let alreadyWishlisted = currentWishlist.find(
      func(id) { id == postId }
    );
    switch (alreadyWishlisted) {
      case (null) {
        let newWishlist = currentWishlist.concat([postId]);
        wishlists.add(sessionKey, newWishlist);
      };
      case (?_) {
        Runtime.trap("Post already in wishlist");
      };
    };
  };

  public shared ({ caller }) func removeFromWishlist(sessionKey : Text, postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage wishlists");
    };
    switch (wishlists.get(sessionKey)) {
      case (null) { Runtime.trap("No wishlist found for session") };
      case (?currentWishlist) {
        let newWishlist = currentWishlist.filter(func(id) { id != postId });
        wishlists.add(sessionKey, newWishlist);
      };
    };
  };

  public query func getWishlist(sessionKey : Text) : async [Nat] {
    switch (wishlists.get(sessionKey)) {
      case (null) { [] };
      case (?wishlist) { wishlist };
    };
  };

  // College Connect functions
  public shared ({ caller }) func submitCollegeConnect(collegeName : Text, year : Text, tip : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit college connects");
    };
    if (tip.size() > 200) {
      Runtime.trap("Tip or message must be 200 characters or less");
    };

    let entryId = nextCollegeConnectId;
    let connectEntry : CollegeConnect = {
      id = entryId;
      collegeName;
      year;
      tip;
      createdAt = Time.now();
    };
    collegeConnects.add(entryId, connectEntry);
    nextCollegeConnectId += 1;
    entryId;
  };

  public query func getAllCollegeConnects() : async [CollegeConnect] {
    let entries = collegeConnects.values().toArray();
    entries.sort(
      func(entry1, entry2) {
        if (entry1.createdAt > entry2.createdAt) {
          #less;
        } else if (entry1.createdAt < entry2.createdAt) {
          #greater;
        } else { #equal };
      }
    );
  };

  // Student availability & DM system methods
  public shared ({ caller }) func createOrUpdateStudentProfile(name : Text, year : Text, college : Text, available : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create or update student profiles");
    };
    let profile : StudentProfile = {
      name;
      collegeYear = year;
      collegeName = college;
      availableForDM = available;
    };
    studentProfiles.add(name, profile);
  };

  public query func isStudentAvailableForDM(name : Text) : async Bool {
    switch (studentProfiles.get(name)) {
      case (null) { false };
      case (?profile) { profile.availableForDM };
    };
  };

  public query func getAvailableStudents() : async [StudentProfile] {
    let profiles = studentProfiles.values().toArray();
    profiles.filter(
      func(profile) {
        profile.availableForDM;
      }
    );
  };

  public shared ({ caller }) func sendDM(sender : Text, recipient : Text, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send direct messages");
    };
    if (message.size() > 200) {
      Runtime.trap("Messages must be 200 characters or less");
    };

    let dm : DMMessage = {
      sender;
      recipient;
      message;
      timestamp = Time.now();
    };

    let recipientMessages = switch (dmMessages.get(recipient)) {
      case (null) { [] };
      case (?messages) { messages };
    };

    let newMessages = recipientMessages.concat([dm]);
    dmMessages.add(recipient, newMessages);

    let senderMessages = switch (dmMessages.get(sender)) {
      case (null) { [] };
      case (?messages) { messages };
    };

    let newSenderMessages = senderMessages.concat([dm]);
    dmMessages.add(sender, newSenderMessages);
  };

  public query ({ caller }) func getConversation(user1 : Text, user2 : Text) : async [DMMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view conversations");
    };
    let user1Messages = switch (dmMessages.get(user1)) {
      case (null) { [] };
      case (?messages) {
        messages.filter(func(msg) { msg.recipient == user2 or msg.sender == user2 });
      };
    };
    let user2Messages = switch (dmMessages.get(user2)) {
      case (null) { [] };
      case (?messages) {
        messages.filter(func(msg) { msg.recipient == user1 or msg.sender == user1 });
      };
    };
    user1Messages.concat(user2Messages);
  };

  // Chat Board methods
  public shared ({ caller }) func postChatMessage(author : Text, year : Text, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post chat messages");
    };
    if (message.size() > 200) {
      Runtime.trap("Messages must be 200 characters or less");
    };

    let chatMessage : ChatMessage = {
      authorName = author;
      collegeYear = year;
      message;
      timestamp = Time.now();
    };

    chatMessages.add(chatMessage);
    if (chatMessages.size() > 50) {
      let excess = chatMessages.size() - 50 : Nat + 1;
      for (i in Nat.range(0, excess)) { ignore chatMessages.removeLast() };
    };
  };

  public query func getLatestChatMessages(limit : Nat) : async [ChatMessage] {
    let size = chatMessages.size();
    let actualLimit = if (limit > 50) { 50 } else { limit };

    if (size == 0) { return [] };

    let sliceSize = if (size > actualLimit) { actualLimit } else { size };
    let messagesArray = chatMessages.toArray();
    messagesArray.sliceToArray(0, sliceSize);
  };

  // Feedback system methods
  public shared ({ caller }) func submitFeedback(author : Text, year : Text, feedback : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit feedback");
    };
    if (feedback.size() > 500) {
      Runtime.trap("Feedback must be 500 characters or less");
    };

    let entry : FeedbackEntry = {
      authorName = author;
      collegeYear = year;
      feedback;
      timestamp = Time.now();
    };

    feedbackEntries.add(entry);
  };

  public query ({ caller }) func getAllFeedbackEntries() : async [FeedbackEntry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all feedback entries");
    };
    let entries = feedbackEntries.toArray();
    entries.sort(
      func(entry1, entry2) {
        if (entry1.timestamp > entry2.timestamp) {
          #less;
        } else if (entry1.timestamp < entry2.timestamp) {
          #greater;
        } else { #equal };
      }
    );
  };
};
