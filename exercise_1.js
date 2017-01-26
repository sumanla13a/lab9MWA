// Book
{
	"_id": "",
	"ISDN": "",
	"tags": [],
	"author": [],
	"borrowed": {
		"status":"",
		"by": "",
		"borrowedDate": "",
		"returnDate": ""
	}
}

// User
{
	"_id": "",
	"user": "",
	"email": "",
	"role": ""
}


db.books.ensureIndex({tags: 1})