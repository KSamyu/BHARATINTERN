const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/MoneyTracker', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

const expenseSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    date: String
});

const budgetSchema = new mongoose.Schema({
    totalBudget: Number,
    totalExpenses: { type: Number, default: 0 },
    budgetLeft: Number
});

const Expense = mongoose.model('Expense', expenseSchema);
const Budget = mongoose.model('Budget', budgetSchema);

app.post("/addExpense", async (req, res) => {
    try {
        const newExpense = new Expense(req.body);
        const expense = await newExpense.save();
        console.log("Expense Inserted Successfully!!!");
        return res.status(200).send(expense);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Error inserting expense.");
    }
});

app.post("/setBudget", async (req, res) => {
    try {
        const totalBudget = req.body.totalBudget;
        const budget = await Budget.findOneAndUpdate({}, { totalBudget: totalBudget, budgetLeft: totalBudget }, { upsert: true, new: true });
        console.log("Budget Set Successfully!!!");
        return res.status(200).send(budget);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Error setting budget.");
    }
});

app.get("/getBudget", async (req, res) => {
    try {
        const budget = await Budget.findOne({});
        return res.status(200).send(budget);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Error getting budget.");
    }
});

app.delete("/deleteExpense/:id", async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        console.log("Expense Deleted Successfully!!!");
        return res.status(200).send("Expense Deleted Successfully");
    } catch (err) {
        console.log(err);
        return res.status(500).send("Error deleting expense.");
    }
});

app.get("/", (req, res) => {
    res.set({
        "Access-Control-Allow-Origin": '*'
    });
    return res.sendFile(path.join(__dirname, 'mt2.html'));
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
