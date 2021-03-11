const Category = require('../models/category');
const Book = require('../models/book');
const Review = require('../models/review');
const User = require('../models/user');

const allCategory = async() => {
      try {
          const categories = await Category.find();
          return categories.map(category => {
              return{
                  ...category._doc
              }
          });
      } catch (error) {
          throw error;
      }
}

const catBooks = async(catId)=> {
      try {
          const books = await Book.find({categoryId: catId}).sort({time:-1});
          return books.map(book => {
              return{
                  ...book._doc
              }
          })
      } catch (error) {
          throw error;
      }
}
const collectionBooks = async(catId)=> {
    try {
        const books = await Book.find({categoryId: catId}).sort({time:-1}).limit(4);
        return books.map(book => {
            return{
                ...book._doc
            }
        })
    } catch (error) {
        throw error;
    }
}

const allBooks = async() =>{
    const books = await Book.find().sort({time:-1}).limit(40);
    return books.map(book => {
        return{
            ...book._doc
        }
    })
}
const findUser = async(userId) =>{
    const user = await User.findById(userId);
    return{
        ...user._doc
    }
}
const bookReviews = async(reviewIds) => {
    const reviews = await Review.find({_id:{$in: reviewIds}}).sort({time: -1});
    return reviews.map(review => {
        return{
            ...review._doc,
            user:findUser.bind(this, review.user)
        }
    })
}

exports.allCategory = allCategory;
exports.catBooks = catBooks;
exports.allBooks = allBooks;
exports.bookReviews = bookReviews;
exports.findUser = findUser;
exports.collectionBooks = collectionBooks;