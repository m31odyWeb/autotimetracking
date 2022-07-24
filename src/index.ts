import { bitbucketAPI } from './bitbucket-api';
import { googleSheetsApi } from './google-sheets-api';
import readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

const fillMonth = async (range: string) => {
  try {
    const commits = await bitbucketAPI.getCommitsForAllMonth();
    await googleSheetsApi.insertData(range, commits);
    console.log('Successfully filled!');
  } catch (error) {
    console.log(error);
  }
};
const fillToday = async (range: string) => {
  try {
    const commits = await bitbucketAPI.getTodayCommits();
    await googleSheetsApi.insertData(range, commits);
    console.log('Successfully filled!');
  } catch (error) {
    console.log(error);
  }
};
const fillDate = async (date: string, range: string) => {
  try {
    const commits = await bitbucketAPI.getCommitsByDate(date);
    await googleSheetsApi.insertData(range, commits);
    console.log('Successfully filled!');
  } catch (error) {
    console.log(error);
  }
};

const mode = process.env.MODE;

switch (mode) {
  case 'FILL_MONTH': {
    const rl = readline.createInterface({ input, output });

    console.log('*****You start to fill your timetracker for current month...*****');
    console.log('');
    rl.question('---Specify a cell range---\nSupported format : NameOfSheet!A1:D1\nRange: ', {}, (range) => {
      console.log('');
      console.log('In process...');
      console.log('');
      fillMonth(range);
      rl.close();
    });

    break;
  }

  case 'FILL_DATE': {
    const rl = readline.createInterface({ input, output });

    let date: string;
    let range: string;

    console.log('***You start to fill your timetracker for date...***');

    console.log('');
    rl.question('---What date you need to fill?---\nSupported format : YYYY-MM-DD\nDate: ', {}, (answer) => {
      date = answer;
      console.log('');
      rl.question('---Specify a cell range---\nSupported format : NameOfSheet!A1:D1\nRange: ', {}, (answer) => {
        range = answer;
        console.log('');
        console.log('--*--*--*--*--*--*--*--*--*--*--');
        console.log(`         Date: ${date}          `);
        console.log(`         Range: ${date}          `);
        console.log('--*--*--*--*--*--*--*--*--*--*--');
        console.log('');
        rl.question('---It is correct data?---\nYes(y)/No(n): ', {}, (answer) => {
          if (answer === 'y') {
            console.log('');
            console.log('In process...');
            console.log('');

            fillDate(date, range);
            rl.close();
          } else {
            console.log('');
            console.log('Aborted...');
            rl.close();
          }
        });
      });
    });
    break;
  }
  default: {
    const rl = readline.createInterface({ input, output });

    console.log('***You start to fill your timetracker for current date...***');
    console.log('');

    rl.question('---Specify a cell range---\nSupported format : NameOfSheet!A1:D1\nRange: ', {}, (range) => {
      console.log('--*--*--*--*--*--*--*--*--*--*--');
      console.log('');
      console.log('In process...');

      fillToday(range);
      rl.close();
    });

    break;
  }
}
