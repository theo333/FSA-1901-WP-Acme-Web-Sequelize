const express = require('express');
const db = require('./db');

const app = express();
module.exports = app;

app.use((req, res, next) => {
	db.getPages()
		.then( pages => {
			req.pages = pages;
			next();
		})
		.catch(next);
});

const renderHeader = (pages, page) => {
	return `
		<header>
			<h1>${page.name}</h1>
			<nav>
				<ul class="nav nav-tabs">
					${ pages.map( _page => {
						return `
							<li class="nav-item">
							<a href="/pages/${_page.id}" class="nav-link ${page.id === _page.id ? 'active' : ''}">${_page.name}</a>
							</li>	
						`;
					}).join('')
					}
				</ul>
			</nav>
		</header>
	`;
};

const renderContents = (contents) => {
	return `
		<main>
			<ul class='list-group'>
				${ contents.map(content => {
					return `
						<li class='list-group-item'>
							<h2>${content.title}</h2>
							<p>${content.body}</p>
						</li>
					`;
				}).join('')}
			</ul>
		</main>
	`;
};

const renderPage = ( {pages, page, contents} ) => {
	return `
		<!DOCTYPE html>
		<html>
			<head>
				<link rel='stylesheet' type='text/css'  href='https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css'' />
				<title>Acme Web</title>
				<style>
					body { font-size: 16px; }
					h1 { font-size: 2em; }
					h2 { font-size: 1.5em; }
					section {  }
				</style>
			</head>
			<body>
				<div class="container">
				<div style='font-size: 2.5em'>Acme Web</div>
				${renderHeader(pages, page)}
				${renderContents(contents)}
				</div>
				</body>
			</html>
	`;
}

app.get('/', (req, res, next) => {
	res.send(req.pages);
	next();
});

app.get('/pages/:id', (req, res, next) => {
	const page = req.pages.find(page => page.id === req.params.id*1);
	db.getContents(page.id)
		.then( contents => {
			res.send(renderPage( {pages: req.pages, page, contents} ));
		})
		.catch(next);
});



