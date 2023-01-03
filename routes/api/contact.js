const express = require("express");
const router = express.Router();
const Contact = require("../../models/contact");

// get All contacts
router.get("/", async (req, res) => {
    try {
        const contacts = await (
            await Contact.find()
        ).filter((contact) => contact.isActive === true);

        res.json(contacts);
    } catch (err) {
        if (err) {
            return res.status(400).json({
                error: "Your request could not be processed. Please try again.",
            });
        }
    }
});
// Add contact
router.post("/", async (req, res) => {
    const contact = new Contact(Object.assign(req.body));
    console.log("hit", req.body)

    // try {
    const c1 = await contact.save();
    res.status(200).json({
        success: true,
        message: `Contact has been added successfully!`,
        contact: c1,
    });
    // } catch (err) {
    //   if (err) {
    //     return res.status(400).json({
    //       error: "Your request could not be processed. Please try again.",
    //     });
    //   }
    // }
});

module.exports = router;
