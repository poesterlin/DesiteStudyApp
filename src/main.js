import App from './App.svelte';
import Study from './Study.svelte';
import Results from './Results.svelte';
import Charts from './Charts.svelte';

import crayon from 'crayon'
import svelte from 'crayon-svelte'

const outlet = document.body
const app = crayon.create()

app.use(svelte.router(outlet))


app.path('/', (req, res) =>
	res.mount(App, { req, nav: app })
)

app.path('/study', (req, res) =>
	res.mount(Study, { req, nav: app })
)

app.path('/results', (req, res) =>
	res.mount(Results, { req, nav: app })
)

app.path('/charts', (req, res) =>
	res.mount(Charts, { req, nav: app })
)

app.load()
