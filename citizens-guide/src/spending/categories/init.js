import { select, selectAll } from 'd3-selection';
import { byYear } from '../data-spending';
import { drawChart as barChart } from './bar/chart';
import colors from '../../colors.scss';
import { establishContainer } from '../../utils';

const d3 = { select, selectAll },
    chartTitle = d3.select('h2.chart-title .title-text'),
    selectBudgetFunction = d3.select('#select-budget-function'),
    selectAgency = d3.select('#select-agency'),
    barControls = d3.select('#bar-controls'),
    chartSectionTextStr = 'Click to see subcategories';

let svg,
    config = {
        data: byYear(2018),
        sectionColor: colors.colorSpendingPrimary,
        dataType: 'function',
        accessibilityAttrs : {
            title: '2018 Federal Spending by Category and Agency',
            desc: 'The federal government reports spending by category and by agency. \n' +
            'The top five spending categories for 2018 were Social Security with $988 billion (24% of total spending), National Defense with $665 billion (16%), Medicare with $589 billion (14%), Health with $519 billion (13%) and Income Security with $496 billion (12%). \n' +
            'The top five agencies by federal spending for 2018 were Department of Health and Human Services with $1.1 trillion (27% of total spending), Social Security Administration with $1 trillion (25%), Department of the Treasury with $629 billion (15%), Department of Defense – Military Programs with $601 billion (15%) and Department of Veterans Affairs with $179 billion (4%).\n'
        }
    },
    debounce,
    top10 = true,
    chartType = 'bar';

function initSection() {
    const vizSection = d3.select('#viz');
    vizSection.select('#vizChartSectionText').remove();
    vizSection.append('div')
        .attr('id', 'vizChartSectionText')
        .text(chartSectionTextStr);

    initChart();
}

export function initChart(filteredData, showAll) {
    const configData = config.dataType ? config.data[config.dataType] : config.data;

    const d = filteredData || configData,
        chartData = top10 ? d.slice(0,9) : d;

    d3.selectAll('svg').remove();
    barChart(chartData, config.dataType, config);
}

function showMore() {
    top10 = !top10;

    this.innerText = top10 ? 'Show More' : 'Show Less';

    initChart()
}

function changeDataTypeClickFunction(){
    d3.select('.link-button__div')
        .on('click', function () {
            const sectionToLoad = d3.select('.link-button__div').selectAll('.hidden');
            const buttonId = sectionToLoad.attr('id');
            const isAgencyLoadingInd = buttonId.search('agency') > 0;

            if (isAgencyLoadingInd) {
                config.dataType = 'agency';
                selectAgency.classed('hidden', false);
                selectBudgetFunction.classed('hidden', true);
            } else {
                config.dataType = 'function';
                selectAgency.classed('hidden', true);
                selectBudgetFunction.classed('hidden', false);
            }
            initChart();
        });
}

function spendingIndexClickFunctions() {

    d3.select('#filter-by-name')
        .on('input', function () {
            const v = this.value.toLowerCase(),
                curData = config.dataType ? config.data[config.dataType] : config.data,
                filtered = curData.filter(r => {
                    return (r.activity.toLowerCase().indexOf(v) !== -1);
                });

            initChart(filtered)
        });

    d3.select('#show-more-button')
        .on('click', showMore);
}

function displayShowMoreSection(showMoreInd){
    d3.selectAll('.categories__show-more').classed('hidden', !showMoreInd);
}

export function init(_config){
    config = _config || config;

    /*
     * The following seems odd in the since that it's an init function; however, revenue currently uses the same
     * html file and swaps between a bargraph and sankey. It's not out of the question that data could change between
     * calling this init function, so we have to set the top10 and hide/show the "Show More" button section as a result.
     */

    if(config.data.length <= 10){
        top10 = false;
        displayShowMoreSection(top10);
    } else {
        top10 = true;
        displayShowMoreSection(top10);
    }

    spendingIndexClickFunctions();
    if(config.dataType){
        changeDataTypeClickFunction();
    }
    initSection();
}