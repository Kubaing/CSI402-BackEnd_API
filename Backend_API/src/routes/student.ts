import express, { Request, Response } from "express";
import students from "../db";

const router = express.Router();


router.post("/", (req: Request, res: Response) => {  
  const { student_id, name } = req.body;
  if (!student_id || !name) {
    return res.status(400).json({ error: "Missing student_id or name" });
  }
  if (students[student_id]) {
    return res.status(400).json({ error: "Student ID already exists" });
  }
  students[student_id] = { student_id, name, points: 1000 };
  res.json({ message: "Student created", student: students[student_id] });
});


router.get("/:student_id", (req: Request, res: Response) => {
  const student = students[req.params.student_id];
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.json(student);
});

router.post("/:student_id/earn", (req: Request, res: Response) => {
  const { amount } = req.body;
  const student = students[req.params.student_id];

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  if (!amount || amount < 100) {
    return res.status(400).json({ error: "Amount must be at least 100" });
  }

  const earnedPoints = Math.floor(amount / 100) * 10;
  student.points += earnedPoints;

  res.json({ message: "Points added", points: student.points });
});

router.get("/:student_id/points", (req: Request, res: Response) => {
  const student = students[req.params.student_id];
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.json({ student_id: student.student_id, points: student.points });
});

export default router;
