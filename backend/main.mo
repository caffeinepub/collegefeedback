import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

// Use MixinStorage for blob storage capabilities.
actor {
  include MixinStorage();

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

  public func createPost(
    content : Text,
    authorYear : Text,
    category : Category,
  ) : async Nat {
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

  public query ({ caller }) func getAllPosts() : async [Post] {
    posts.values().toArray();
  };

  public query ({ caller }) func getPostsByCategory(category : Category) : async [Post] {
    posts.values().toArray().filter(
      func(p) {
        p.category == category;
      }
    );
  };

  public query ({ caller }) func getStats() : async PostStats {
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
  public func addToWishlist(sessionKey : Text, postId : Nat) : async () {
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

  public func removeFromWishlist(sessionKey : Text, postId : Nat) : async () {
    switch (wishlists.get(sessionKey)) {
      case (null) { Runtime.trap("No wishlist found for session") };
      case (?currentWishlist) {
        let newWishlist = currentWishlist.filter(func(id) { id != postId });
        wishlists.add(sessionKey, newWishlist);
      };
    };
  };

  public query ({ caller }) func getWishlist(sessionKey : Text) : async [Nat] {
    switch (wishlists.get(sessionKey)) {
      case (null) { [] };
      case (?wishlist) { wishlist };
    };
  };

  // College Connect functions
  public func submitCollegeConnect(collegeName : Text, year : Text, tip : Text) : async Nat {
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

  public query ({ caller }) func getAllCollegeConnects() : async [CollegeConnect] {
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
};
