const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const path = require('path');
const fs = require('fs');

const User = require('../models/user');
const Book = require('../models/book');
const Admin = require('../models/admin');
const Review = require('../models/review');
const Category = require('../models/category');

const stripe = require('stripe')('sk_test_51I5VEyKIeRwnUDgWu1uxP5z5nqqO2M7XzRD1q3wBPswb5bm4sCQz0aobCJu0tjeuY0qew1inHuZjTpHSdhAwXrYp00UT29SAcQ');
const uuid = require('uuidv4');

const { allCategory, allBooks,catBooks, bookReviews, findUser, collectionBooks } = require('./merge');

module.exports = {
    Query:{
        signIn: async(args, req) =>{
            try {
                const user = await User.findOne({email: req.email});
                if(!user){
                  return{
                      success: false,
                      error_message: 'Invalid account credentials!'
                  }
                }
                if(!user.password){
                    return{
                        success: false,
                        error_message: 'Invalid account credentials!'
                    }
                }
                const match = await bcrypt.compare(req.password, user.password);
                if(!match){
                  return{
                      success: false,
                      error_message:"Password doesn't match."
                  }
              }
              const token = jwt.sign(
                  {userId: user.id, email: user.email},
                  'somespecialsecretkey',
                  {
                      expiresIn: '365d'
               });
              return{
                  success: true,
                  userId:user.id,
                  token,
                  paidMembership: user.paidMembership
              }
            } catch (error) {
                throw error;
            }
      },
      user: async(args, req) =>{
        try {
            const decodedToken = jwt.verify(req.token, 'somespecialsecretkey');
           
            const user = await User.findById(decodedToken.userId);
            if(!user){
                throw new Error('User not found!');
            }
            
            return{
                _id:user._id,
                paidMembership:user.paidMembership,
                password: null,
                
            }
        } catch (error) {
            throw error;
        }
    },
    dashboard: async() =>{
        try {
            return{
                categories: allCategory.bind(this),
                books: allBooks.bind(this)
            }
        } catch (error) {
            throw error;
        }
    },
    exploreCategory: async(args, req) => {
        try {
            return{
                categories: allCategory.bind(this),
                books: catBooks.bind(this, req.catId)
            }
        } catch (error) {
            throw error;
        }
      },
      book: async(args, req) => {
        try {
            const book = await Book.findById(req.bookId);
            if(!book){
                throw new error('Book not found');
            }
            return{
                ...book._doc,
                userReviews: bookReviews.bind(this, book.reviews)
            }
        } catch (error) {
            throw error;
        }
    },
      savedBooks: async(args, req) => {
          try {
            const decodedToken = jwt.verify(req.token, 'somespecialsecretkey');
            const user = await User.findById(decodedToken.userId);

            const books = await Book.find({_id:{$in: user.savedBook}});
            return books.map(book => {
                return{
                    ...book._doc
                }
            });
          } catch (error) {
              throw error;
          }
      },
      adminLogin: async(args, req) =>{
          try {
              const admin = await Admin.findOne({userName: req.userName});
              if(!admin){
                return{
                    success: false,
                    error_message:"Wrong credentials"
                }
              }
              const match = await bcrypt.compare(req.password, admin.password);
              if(!match){
                return{
                    success: false,
                    error_message:"Username and Password doesn't match"
                }
              }
              const token = jwt.sign(
                {userId: admin.id, email: admin.userName},
                'somespecialsecretkey',
                {
                    expiresIn: '365d'
             });
             return{
                 success: true,
                 token
             }

          } catch (error) {
              throw error;
          }
      },
      search: async(args, req) => {
          try {
              const books = await Book.find({$text:{$search:req.searchText}});
               return books.map(book =>{
                    return{
                        ...book._doc
                    }
                });
            
          } catch (error) {
              throw error;
          }
      },
      userFeed: async(args, req) =>{
          const categories = await Category.find();
          return categories.map(category => {
              return{
                  ...category._doc,
                  books: collectionBooks.bind(this, category._id)
              }
          });
      }
    },
    Mutation:{
        addBook: async(args, req) =>{
            try {
                let d = new Date();
                let time = d.getTime();
                const book = new Book ({
                    _id: new mongoose.Types.ObjectId(),
                    title: req.bookInput.title,
                    bookCover:  req.bookInput.bookCover,
                    bookFileUrl:  req.bookInput.bookFileUrl,
                    bookCoverUrl: req.bookInput.bookCoverUrl,
                    paidStatus:  req.bookInput.paidStatus,
                    author:  req.bookInput.author,
                    categoryId:  req.bookInput.categoryId,
                    createdAt: new Date().toISOString(),
                    time,
                    searchTags: req.bookInput.title +" "+ req.bookInput.author
                });
                await book.save();
                const books = await Book.find().sort({time:-1}).limit(60);
                return books.map(book => {
                    return{
                        ...book._doc
                    }
               });
            }catch (error){
                throw error;
            }
     },
     deleteBook: async(args, req) =>{
        try {
           const book = await Book.findById(req.bookId);
           if(!book){
               throw new Error('Book not found');
           }
           await book.remove();
           return{
               ...book._doc
           }
        } catch (error) {
            throw error;
        }
     },
     updateBook: async(args, req) => {
        try {
            const book = await Book.findById(req.bookId);
            await book.updateOne({title:req.title, author: req.author, bookFileUrl: req.bookFileUrl, categoryId:req.categoryId, paidStatus: req.paidStatus});

            const books = await Book.find().sort({time: -1}).limit(60);
            return books.map(book => {
                 return{
                     ...book._doc
                 }
            });
        } catch (error) {
            throw error;
        }
     },
     uploadFile: async(parent, { file }) => {
       const { createReadStream, filename, mimetype, encoding} = await file;

       const stream = createReadStream();
       const pathName = path.join(__dirname, `../../public/bookfiles/${filename}`);
       await stream.pipe(fs.createWriteStream(pathName));
       return{
           url:`http://localhost:4000/bookfiles/${filename}`
       }
    },
    uploadBookCover: async(parent, { file }) => {
        const { createReadStream, filename, mimetype, encoding} = await file;
 
        const stream = createReadStream();
        const pathName = path.join(__dirname, `../../public/bookCovers/${filename}`);
        await stream.pipe(fs.createWriteStream(pathName));
        return{
            url:`http://localhost:4000/bookCovers/${filename}`
        }
     },
   
    signUp: async(args, req) =>{
        try {
            const existingUser = await User.findOne({email: req.email});
            if(existingUser){
               return{
                   success: false,
                   error_message: 'Email aready used. Try another One'
               }
            }
            const hashPass = await bcrypt.hash(req.password, 10);

            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.email,
                password: hashPass,
                userName: req.userName
            });
            await user.save();
            
            const token = jwt.sign(
                {userId: user.id, email: user.email},
                'somespecialsecretkey',
                {
                    expiresIn: '365d'
             });
            return{
                success: true,
                userId:user.id,
                token,
                paidMembership: user.paidMembership
            }
        } catch (error) {
            throw error;
        }
    },
    googleSignIn: async(args, req) =>{
        try {
            const user = await User.findOne({email: req.email});
            if(user){
                const token = jwt.sign(
                    {userId: user.id, email: user.email},
                    'somespecialsecretkey',
                    {
                        expiresIn: '365d'
                 });
                return{
                    success: true,
                    userId:user.id,
                    token,
                    paidMembership: user.paidMembership
                }
            }
            const new_user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.email,
                userName: req.userName
            });

            await new_user.save();
            const token = jwt.sign(
                {userId: new_user.id, email: req.email},
                'somespecialsecretkey',
                {
                    expiresIn: '365d'
             });
            return{
                success: true,
                userId:new_user.id,
                token,
                paidMembership: new_user.paidMembership
            }

        } catch (error) {
            throw error;
        }

    },
    saveBook: async(args, req)=>{
        try {
            const user = await User.findById(req.userId);
            if(!user){
                throw new Error('User not found!')
            }
            if(user.savedBook.includes(req.bookId)){
                return{
                    ...book._doc
                }
            }
          await user.savedBook.push(req.bookId);
          await user.save();
          return{
              ...book._doc
          }
    
        } catch (error) {
            throw error;
        }
    },
    removeBook: async(args, req)=>{
        try {
            const user = await User.findById(req.userId);
            console.log(user);
            if(!user){
                throw new Error('User not found!')
            }
          await user.savedBook.pull(req.bookId);
          await user.save();
          return{
              ...book._doc
          }
    
        } catch (error) {
            throw error;
        }
    },
    payment: async(args, req) => {
        try {
            console.log("Id",req.token.id);
            const token = req.token;
            // const idempotency_Key = uuid();
             const customer = await stripe.customers.create({
                email: token.email,
                source: token.id
              });
            //   const charge = await stripe.charges.create({
            //     customer: customer.id,
            //     amount: 1000,
            //     currency: 'usd',
            //   });
           
          
            const user = await User.findById(req.userId);
            await user.updateOne({paidMembership: true});
            return{
                success: true
            }
        } catch (error) {
            throw error;
        }
    },
    createAdmin: async(args, req) => {
        const existingAdmin = await Admin.findOne({userName: req.userName});
        if(existingAdmin){
            throw new Error('Username already exist. try amother one')
        }
        const hashPass = await bcrypt.hash(req.password, 10);
   
        const admin = new Admin({
            _id: new mongoose.Types.ObjectId(),
            userName:req.userName,
            password: hashPass
        });
        await admin.save();
        return{
            ...admin._doc
        }
   },
   createReview: async(args, req) => {
    try{
        let d = new Date();
        let time = d.getTime();
        const review = new Review({
            _id: new mongoose.Types.ObjectId(),
            reviewText: req.reviewInput.reviewText,
            user: req.reviewInput.userId,
            book: req.reviewInput.bookId,
            rating: req.reviewInput.rating,
            createdAt: new Date().toISOString(),
            time
        });
         await review.save();

         const book = await Book.findById(req.reviewInput.bookId);
         await book.reviews.push(review._id);
         await book.save();
        //  const avgrRat = (book.totalRatings) / (book.ratigsUser + 1);
        //  console.log(avgrRat);
         const user = await User.findById(req.reviewInput.userId);
         await user.reviews.push(review._id);
         await user.save();
         
        const reviews = await Review.find({_id:{$in: book.reviews}}).sort({time: -1});
        return reviews.map(review => {
            return{
                ...review._doc,
                user: findUser.bind(this, review.user)
            }
        })
         

    } catch (error) {
        throw error;
    }
}
 },
}
    
 
