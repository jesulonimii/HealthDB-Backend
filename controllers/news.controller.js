import { ErrorResponse, STATUS_CODE, SuccessResponse } from "#utils";
import { newsValidationSchema } from "#helpers/DataValidation";
import { NewsModel } from "#models";

const { BAD_REQUEST, UNAUTHORIZED, CONFLICT, OK, INTERNAL_SERVER_ERROR } = STATUS_CODE;

export const GetAllNews = async (req, res) => {
/*	res.status(OK).send([
		{
			title: "OAU Health Center Announces State-of-the-Art Facilities Upgrade",
			date: "2023-08-04",
			image: "https://universitygist.com/wp-content/uploads/2022/05/OAU.png",
			category: "Health",
			content:
				"In a bid to enhance healthcare services for students and staff, the OAU Health Center unveiled its latest state-of-the-art facilities upgrade. The new facilities include advanced diagnostic equipment, expanded patient rooms, and a modernized pharmacy. With this upgrade, OAU aims to provide cutting-edge medical care to the university community.",
		},
		{
			title: "OAU Health Center Launches Mental Health Awareness Campaign",
			date: "2023-08-04",
			image: "https://universitygist.com/wp-content/uploads/2022/05/OAU.png",
			category: "Health",
			content:
				"Recognizing the importance of mental health in the well-being of students, the OAU Health Center has initiated a month-long mental health awareness campaign. The campaign includes workshops, counseling sessions, and stress management programs. OAU hopes to create a supportive environment that encourages students to seek help and resources for their mental health needs.",
		},
		{
			title: "Outbreak of Flu-Like Illness in OAU Campus",
			date: "2023-08-04",
			image: "https://universitygist.com/wp-content/uploads/2022/05/OAU.png",
			category: "Health",
			content:
				"The OAU Health Center has reported an outbreak of a flu-like illness on the campus. Several students and staff have been affected, leading to an increase in patient visits. Health officials are closely monitoring the situation and advising everyone to practice good hygiene, get vaccinated, and seek immediate medical attention if they experience symptoms like fever, cough, and body aches.",
		},
		{
			title: "OAU Health Center Hosts Blood Donation Drive",
			date: "2023-08-04",
			image: "https://universitygist.com/wp-content/uploads/2022/05/OAU.png",
			category: "Health",
			content:
				"In collaboration with the Red Cross Society, the OAU Health Center organized a blood donation drive on campus. Students and staff came together to donate blood, contributing to a worthy cause and potentially saving lives. The event was a great success, and the OAU Health Center plans to hold such drives regularly to meet the blood demands of the community.",
		},
		{
			title: "New Director Appointed to OAU Health Center",
			date: "2023-08-04",
			image: "https://universitygist.com/wp-content/uploads/2022/05/OAU.png",
			category: "Health",
			content:
				"OAU has appointed Dr. Emily Collins as the new director of the OAU Health Center. Dr. Collins brings extensive experience in healthcare administration and a passion for student health. She aims to implement innovative health programs and foster a patient-centric approach to healthcare at OAU.",
		},
		{
			title: "OAU Health Center's First Aid Team Wins Regional Competition",
			date: "2023-08-04",
			image: "https://universitygist.com/wp-content/uploads/2022/05/OAU.png",
			category: "Health",
			content:
				"The OAU Health Center's First Aid Team emerged victorious in a regional first aid competition. Competing against other universities, the team showcased their skills in emergency response and medical care. Their success reflects the dedication and training provided by the OAU Health Center in ensuring the safety and well-being of the university community.",
		},
	]);*/

	try {
		const articles = await NewsModel.find();
		if (!articles) return res.status(BAD_REQUEST).send(ErrorResponse("No news article found"));

		return res.status(OK).send(articles);
	} catch (e) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(`News articles Retrieval Failed: ${e.message}`));
	}
};

export const PublishNews = async (req, res) => {

	const { error } = newsValidationSchema.validate(req.body);
	if (error) return res.status(BAD_REQUEST).send(ErrorResponse(error.message));


	console.log(req.body);

	const article = new NewsModel({
		...req.body,
		date: new Date(),
	})

	try {
		article.save()
			.then((result) => {
				res.status(OK).send(result);
				//return res.status(OK).send(SuccessResponse("News published successfully"));
			})
			.catch((err) => {
				return new Error(err.message);
			});
	}
	catch (error) {
		return res.status(INTERNAL_SERVER_ERROR).send(ErrorResponse(error.message));
	}



}

export const PushNews = async (req, res) => {

	const set = req.body

	if (!set) return res.status(BAD_REQUEST).send(ErrorResponse("Can't push empty array of news"));

	set.forEach((article) => {

		const newArticle = new NewsModel({
			...article,
			date: new Date(),
		})

		newArticle.save()
			.then((result) => {
				//res.status(OK).send(result);
				//return res.status(OK).send(SuccessResponse("News published successfully"));
			})
			.catch((err) => {
				return new Error(err.message);
			});

	})

	res.status(OK).send(SuccessResponse("News array pushed successfully"));

}

export default {
	GetAllNews,
};
