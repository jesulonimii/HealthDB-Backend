const data = {
	users: [
		{
			id: "csc/2019/108",
			password: "12",
			student: {
				level: 300,
				department: "Computer Science",
				faculty: "Technology",
				matric_number: "CSC/2019/108"
			},
			personal_info: {
				first_name: "William",
				last_name: "Jesulonimi",
				profile_image: "https://jesulonimii.codes/img/me.jpg",
				date_of_birth: "1999-05-10",
				gender: "Male"
			},
			contact_info: {
				address: "Block K101 Angola, OAU Ife",
				phone: "08120474003",
				email: "jesulonimii.will@gmail.com"
			},
			emergency_contacts: [
				{
					name: "Mrs Abodunrin",
					relationship: "Mother",
					phone: "+1 (555) 987-6543"
				},
				{
					name: "Mr Abodunrin",
					relationship: "Father",
					phone: "+1 (555) 246-1357"
				}
			],
			medical_history: {
				allergies: [
					"Asthma",
					"Allergies"
				],
				surgeries: null,
				last_visit: "2023-06-15",
				hospitalizations: [
					{
						reason: "Malaria",
						date: "2023-07-23"
					}
				]
			},
			notifications: [
				{
					title: "New Notification",
					body: "This is a new notification",
					date: "2021-06-15"
				}
			],
			appointments: [
				{
					title: "Appointment",
					date: "2021-06-15"
				}
			],
			completed_app_registration: true,
			health_centre_registration: {
				status: true,
				message: "You are yet to undergo required lab tests.\nPlease visit the health centre to do so in due time."
			},
			pending_appointment: {
				date_time: "2023-07-28T16:30:21.461Z",
				id: "20230728/CSC2019108"
			}
		}
	]
}