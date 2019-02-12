const Sequelize = require('sequelize');

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_web_seq_db', {
	logging: false,
});

const Page = conn.define('page', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	}
});

const Content = conn.define('content', {
	title: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	body: {
		type: Sequelize.TEXT,
	}
});


const getPages = () =>{
	return Page.findAll({
			attributes: ['id','name']
	})
	.then((pages)=>
			pages.map((page)=>{
					return page.dataValues;
			})
	)
}

const getPage = (id) => {
	return Page.findByPk(id)
};

const getContents = (id) => {
	return Content.findAll({
		where: {
			pageId: id,
		}
	})
}

const setupDb = async () => {
  Page.hasMany(Content);
  Content.belongsTo(Page);

	try {
		await conn.sync({ force: true });

		const [homePage, employeesPage, contactPage] = await Promise.all([
			Page.create({name: 'Home'}),
			Page.create({name: 'Employees'}),
			Page.create({name: 'Contact'}),
		]);

		const home1ContentCreated = await Content.create({ title: 'Welcome Home 1', body: 'xoxoxo' });
		const home1AssociatedContent = await home1ContentCreated.setPage(homePage);
		
		const home2ContentCreated = await Content.create({ title: 'Welcome Home 2', body: 'xoxoxo' });
		const home2AssociatedContent = await home2ContentCreated.setPage(homePage);
		
		const employee1ContentCreated = await Content.create({ title: 'Larry', body: 'CTO' });
		const employee1AssociatedContent = await employee1ContentCreated.setPage(employeesPage);
		const employee2ContentCreated = await Content.create({ title: 'Moe', body: 'CEO' });
		const employee2AssociatedContent = await employee2ContentCreated.setPage(employeesPage);
		const employee3ContentCreated = await Content.create({ title: 'Curly', body: 'COO' });
		const employee3AssociatedContent = await employee3ContentCreated.setPage(employeesPage);

		const contact1ContentCreated = await Content.create({ title: 'Phone', body: '212-555-1212' });
		const contact1AssociatedContent = await contact1ContentCreated.setPage(contactPage);
		const contact2ContentCreated = await Content.create({ title: 'Telex', body: '212-555-1213' });
		const contact2AssociatedContent = await contact2ContentCreated.setPage(contactPage);
		const contact3ContentCreated = await Content.create({ title: 'Fax', body: '212-555-1214' });
		const contact3AssociatedContent = await contact3ContentCreated.setPage(contactPage);	
	} catch(err) {
		console.log(err);
	}
  
}

module.exports = {
	setupDb,
	getPages,
	getPage,
	getContents
}

