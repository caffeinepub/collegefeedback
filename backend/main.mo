import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

// Use MixinStorage for blob storage capabilities.
// Specify migration module in actor definition.
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

  public shared ({ caller }) func createPost(
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
};
