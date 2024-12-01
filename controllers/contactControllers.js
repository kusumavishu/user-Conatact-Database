const asyncHandler = require("express-async-handler");
const contact = require("../models/connectModel");

//@desc get all contact
//routes GET /api/contact
//@access public --->Private
const getContact = asyncHandler(async (req, res) => {
  console.log("Body params received:", req.body);

  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const allContact = await contact.find({ user_id: req.user.id });
  console.log("Fetched contacts:", allContact);
  res.status(200).json(allContact);
});

//@desc create contact
//routes POST /api/contact
//@access public--->Private
const createContact = asyncHandler(async (req, res) => {
  console.log("the body params we are sending:", req.body);

  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const { name, email, phoneNumber } = req.body;

  if (!name || !email || !phoneNumber) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const addContact = await contact.create({
    name,
    email,
    phoneNumber,
    user_id: req.user.id,
  });

  res.status(201).json(addContact);
});

//@desc get all contact
//routes GET /api/contact
//@access public --->Private
const getContactbyID = asyncHandler(async (req, res) => {
  const singleContact = await contact.findById(req.params.id);
  if (!singleContact) {
    res.status(404);
    throw new Error("contact not found");
  }
  res.status(200).json(singleContact);
});

//@desc Update contact
//routes PUT /api/contact/:id
//@access public --->Private
const updateContact = asyncHandler(async (req, res) => {
  const singleContact = await contact.findById(req.params.id);
  if (!singleContact) {
    console.log("going to errorhandler file");
    res.status(404);
    throw new Error("contact not found");
  }

  if (singleContact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("user don't have permission to update other user contact");
  }

  const updateContact = await contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res
    .status(201)
    .json({ message: `updated the contact with ${req.params.id}` });
});

//@desc delete contact
//routes DELETE /api/contact/:id
//@access public
const deleteContact = asyncHandler(async (req, res) => {
  const singleContact = await contact.findById(req.params.id);
  console.log("singleContact", singleContact);
  if (!singleContact) {
    console.log("going to errorhandler file");
    res.status(404);
    throw new Error("contact not found");
  }

  if (singleContact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("user don't have permission to update other user contact");
  }

  const deleteContact = await contact.findByIdAndDelete(req.params.id);
  res.status(201).json({ message: `delete the contact with ${req.params.id}` });
});

module.exports = {
  getContact,
  createContact,
  getContactbyID,
  updateContact,
  deleteContact,
};
