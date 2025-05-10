const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose
	.connect('mongodb://localhost:27017/yelp-camp', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log('MongoDB Connection Established');
	})
	.catch((err) => {
		console.log('MongoDB Connection Error');
		console.log(err);
	});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const randomCityIndex = Math.floor(Math.random() * cities.length);
		const price = Math.floor(Math.random() * 200) + 100;
		const camp = new Campground({
			author: '681e86b462d14f3a6b1c36ee',
			location: `${cities[randomCityIndex].city}, ${cities[randomCityIndex].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			image: `https://picsum.photos/400?random=${Math.random()}`,
			description:
				'Nestled in the heart of the Blue Ridge Mountains, Whispering Pines Campground offers a peaceful retreat surrounded by towering pines and babbling brooks. Whether you are a tent camper, RV enthusiast, or looking for a cozy cabin, our campground provides the perfect base for outdoor adventures and family fun.',
			price,
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
