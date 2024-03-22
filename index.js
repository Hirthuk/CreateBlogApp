// Importing necessary modules
import express from "express";
import bodyParser from "body-parser";

// Initializing Express app
const app = express();
const port = 3000;

// Setting up middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Array to store blogs
const blogs = [];

// Middleware to extract title, content, and add id to blogs
function viewDate(req, res, next) {
  // Extracting title and content from the request body
  const title = req.body["Title"];
  const content = req.body["Content"];

  // Checking if both title and content are present
  if (title && content) {
    // Storing the blog in the array with an additional id
    const id = blogs.length + 1;
    blogs.push({ id, title, content });
  }

  // Passing control to the next middleware or route handler
  next();
}

// Using the viewDate middleware for all routes
app.use(viewDate);

// Handling the root route
app.get("/", (req, res) => {
  // Rendering the index.ejs template
  res.render("index.ejs", { blogs });
});

// Handling the /write route
app.get("/write", (req, res) => {
  // Rendering the write.ejs template
  res.render("write.ejs");
});

// Handling the /View route
app.all("/View", (req, res) => {
  // Checking if there are blogs in the array
  if (blogs.length > 0) {
    // Rendering the view.ejs template with the blogs array
    res.render("view.ejs", { blogs });
  } else {
    // Rendering the view.ejs template with an error message
    res.render("index.ejs");
  }
});

// Handling the /update route
app.post("/update/:id", (req, res) => {
  const blogId = req.params.id;
  const updatedTitle = req.body["UpdatedTitle"];
  const updatedContent = req.body["UpdatedContent"];

  // Find the blog in the array based on the ID
  const blogToUpdate = blogs.find(blog => blog.id == blogId);

  // Update the blog if found
  if (blogToUpdate) {
    blogToUpdate.title = updatedTitle;
    blogToUpdate.content = updatedContent;
  }

  // Redirect to the /View route to see the updated list of blogs
  res.redirect("/View");
});

// Handling the /delete route
app.post("/delete/:id", (req, res) => {
  const blogId = req.params.id;

  // Find the index of the blog in the array based on the ID
  const blogIndex = blogs.findIndex(blog => blog.id == blogId);

  // Remove the blog from the array
  if (blogIndex !== -1) {
    blogs.splice(blogIndex, 1);
  }

  // Redirect to the /View route to see the updated list of blogs
  res.redirect("/View");
});

// Starting the server and listening on the specified port
app.listen(port, () => {
  console.log(`Server started and running in ${port}`);
});
