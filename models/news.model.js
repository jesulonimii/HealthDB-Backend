import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		date: { type: Date, required: true },
		content: { type: String, required: true },
		image: { type: String, default: "https://universitygist.com/wp-content/uploads/2022/05/OAU.png" },
		category: { type: String, default: "Health" },
	},
	{ timestamps: true }
);



const NewsModel = mongoose.model('News_Article', newsSchema)

export default NewsModel