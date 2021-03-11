const { gql} = require('apollo-server');
module.exports = gql`
 type User{
    _id: ID
    userName:String
    email:String
    password:String
    reviews:[Review!]
    paidMembership: Boolean
   
 }
 type AuthData{
    userId: ID
    token: String
    success: Boolean
    error_message: String
    paidMembership: Boolean
}
type Book{
    _id: ID
    title: String
    author: String!
    bookCoverUrl: String
    paidStatus: Boolean
    bookFileUrl: String
    categoryId:String!
    totalRatings:Int,
    ratigsUser: Int,
    averageRatings:Float
    time: Int
    createdAt:String
    userReviews:[Review!]
}
input BookInput{
    title: String
    categoryId:String!
    author:String!
    paidStatus:Boolean
    bookFileUrl:String!
    bookCoverUrl: String
}
type Review{
    _id: ID
    reviewText: String
    rating: Int,
    user: User!
    book:String
    createdAt: String
}

input ReviewInput{
    reviewText: String!
    rating: Int,
    userId: String!
    bookId:String!
}

type Category{
    _id: ID
    name: String
    books:[Book]
}
type Admin{
    _id: ID
    userName: String,
    password: String
}

type ExploreCategory{
    categories:[Category!]
    books:[Book!]
}
type File {
        url:String
 }
type Dashboard{
    categories:[Category!]
    books:[Book!]
}
type Payment{
    success: Boolean
}

type Query{
     user(token:String):User!
     signIn(email: String, password: String):AuthData!
     savedBooks(token:String): [Book!]

     exploreCategory(catId:String, ratings: Int):ExploreCategory!
     book(bookId: String):Book!

     dashboard:Dashboard!

     adminLogin(userName: String,password: String): AuthData!

     search(searchText: String):[Book!]

     userFeed:[Category!]
 }

type Mutation{
    signUp(email: String, password: String, userName:String):AuthData!
    googleSignIn(email:String, userName:String):AuthData!
    saveBook(userId: String, bookId: String): Book!
    removeBook(userId: String, bookId:String): Book!

    addBook(bookInput: BookInput):[Book!]
    deleteBook(bookId: String): Book!
    updateBook(bookId: String, title:String,author:String, bookFileUrl: String,bookCoverUrl:String, paidStatus: Boolean, categoryId: String):[Book!]
    uploadFile(file: Upload!): File!
    uploadBookCover(file:Upload!):File!
    
    createReview(reviewInput: ReviewInput):[Review!]

    addCategory(name: String): Category!

    payment(token: String!, userId: String!):Payment!

    createAdmin(userName: String, password:String):Admin!
 }
`
