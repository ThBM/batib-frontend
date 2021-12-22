//Fontawesome
import '@fortawesome/fontawesome-free/css/all.min.css';

//jQuery and provide
import $ from 'jquery';
window.$ = window.jQuery = $;

//Bootstrap including popper
import 'bootstrap/dist/js/bootstrap.bundle.min';

//ChartJS and provide
import Chart from 'chart.js';
window.Chart = Chart;

//Carbon CSS & JS
import "../css/custom.scss";
import '../carbon/css/styles.css';
import '../carbon/js/carbon';

//Custom CSS
import '../css/app.scss';

//Datatables CSS & JS and provide
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css'
import Datatable from 'datatables.net-bs4';
window.Datatable = Datatable;
import './datatables';


//Extend with custom method to transform String to float
import './String.Extension';


//Moment.js for date
import moment from 'moment';
moment.locale('fr');
window.moment = moment;

//Sortable element on jQuery
import addSortable from './jQuery.addSortable';
addSortable($);

//Format element on jQuery
import formatData from './jQuery.formatData';
formatData($);

import addEdition from './jQuery.addEdition';
addEdition($);


import './app';