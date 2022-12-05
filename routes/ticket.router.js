const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");
const {
  insertTicket,
  getTickets,
  getTicketById,
  updateClientReply,
  updateStatusClose,
  deleteTicket,
} = require("../model/ticket/ticket.model");

const router = require("express").Router();

// create url endponts
// recieve new ticket data
// authorize every request with jwt
// insert in mongodb
// retrive all the ticket for the specific user
// retrive a ticket from mongodb
// update message conversation in the ticket db
// update ticket status // close, operator responsive pending,client response pending
// delete ticket from mongodb

router.all("/", (req, res, next) => {
  // res.json({ message: "return from user route" });
  next();
});

router.post("/", userAuthorization, async (req, res) => {
  const { subject, sender, message } = req.body;
  try {
    console.log(req.userId);
    const ticketObj = {
      clientId: req.userId,
      subject,
      conversation: [
        {
          sender,
          message,
        },
      ],
    };
    const result = await insertTicket(ticketObj);
    console.log(result);
    if (result._id) {
      return res.json({
        status: "success",
        message: "New ticket has been created",
      });
    }

    return res.json({
      status: "error",
      message: "unable to create the ticket, please try again later",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      message: "unable to create the ticket, please try again later",
    });
  }
});

router.get("/", userAuthorization, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await getTickets(userId);

    console.log(result);

    if (result.length) {
      return res.json({ status: "success", result });
    }
    return res.json({
      status: "error",
      message: "Unable to get tickets. Please try again",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      message: "Unable to get tickets. Please try again",
    });
  }
});

router.get("/:_id", userAuthorization, async (req, res) => {
  try {
    const _id = req.params._id;
    const clientId = req.userId;
    console.log(_id, clientId);
    let result = await getTicketById(_id, clientId);

    if (result._id) return res.json({ status: "success", result });
    return res.json({ status: "error", message: "Unable to get the ticket" });
  } catch (error) {
    return res.json({ status: "error", message: "Unable to get the ticket" });
  }
});

router.put("/:_id", userAuthorization, async (req, res) => {
  try {
    const { message, sender } = req.body;
    const { _id } = req.params;
    const clientId = req.userId;
    const result = await updateClientReply({ _id, message, sender });

    if (result._id) {
      return res.json({ status: "success", message: "your message updated" });
    }

    return res.json({
      status: "error",
      message: "unable to update your message. please try again.",
    });
  } catch (error) {
    return res.json(error);
  }
});

router.patch("/close_ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;
    const result = await updateStatusClose({ _id, clientId });

    if (result._id) {
      return res.json({
        status: "success",
        message: "The ticket has been closed",
      });
    }

    return res.json({
      status: "error",
      message: "unable to close ticket. please try again.",
    });
  } catch (error) {
    return res.json(error);
  }
});

router.delete("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await deleteTicket({ _id, clientId });

    if (result._id) {
      return res.json({
        status: "success",
        message: "The ticket has been deleted",
      });
    }

    return res.json({
      status: "error",
      message: "unable to delete ticket. please try again.",
    });
  } catch (error) {
    return res.json(error);
  }
});

module.exports = router;
