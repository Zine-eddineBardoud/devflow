import { Document, model, models, Schema, Types } from "mongoose";

export interface IQuestion {
    title: string;
    content: string;
    tags: Types.ObjectId[];
    views: number;
    upvotes: number;
    downvotes: number;
    answers: number;
    author: Types.ObjectId;
}

export interface IQuestionDoc extends IQuestion, Document {}

const QuestionSchema = new Schema<IQuestion>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
        views: { type: Number, default: 0 },
        upvotes: { type: Number, ref: "User" },
        downvotes: { type: Number, ref: "User" },
        answers: { type: Number, ref: "Answer" },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

const Question =
    models?.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
