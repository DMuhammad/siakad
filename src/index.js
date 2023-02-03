const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const excelJS = require('exceljs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const readlineSync = require('readline-sync');

const workBook = new excelJS.Workbook();

module.exports = { puppeteer, cheerio, fs, inquirer, chalk, readlineSync, workBook } ;