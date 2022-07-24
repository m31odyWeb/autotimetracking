import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import 'dotenv/config';
import { ICommit, IGetCommitsRes } from './types';

const USERNAME = process.env.USERNAME;
const USER_PASS = process.env.USER_PASS;
const NICK_NAME = process.env.NICK_NAME as string;
const BASE_URL = process.env.BASE_URL;
const WORKSPACE = process.env.WORKSPACE;
const REPO = process.env.REPO;

const CREDENTIALS = Buffer.from(`${USERNAME}:${USER_PASS}`).toString('base64');

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: 'Basic ' + CREDENTIALS,
    Accept: 'application/json',
  },
});

const { get } = api;

const getCommits = async (page = 1) => {
  const url = WORKSPACE + '/' + REPO + '/commits?page=' + page;
  try {
    const { data } = await get<IGetCommitsRes>(url);
    const { values, next } = data;
    return { values, next };
  } catch (err: any) {
    const { data, status } = err;
    throw { data, status };
  }
};

const checkCommits = async (commits: ICommit[], nickname: string, date: Dayjs, isEquel = false) => {
  const filteredCommits = commits.filter((commit) => {
    const formattedCommitAuthor = commit.author.raw.toLowerCase().replace(/\s/g, '');
    const formattedNickname = nickname.toLowerCase().replace(/\s/g, '');

    const isDateBefore = isEquel ? date.isSame(dayjs(commit.date).startOf('day')) : date.isBefore(dayjs(commit.date));
    const isValidAuthor = formattedCommitAuthor.includes(formattedNickname);
    const isMergeCommit = commit.message.toLowerCase().includes('merge');

    if (isDateBefore && isValidAuthor && !isMergeCommit) return true;
    else return false;
  });

  const formattedCommits = filteredCommits.map(({ author, message, date }) => {
    const commitDate = dayjs(date).format('DD.MM.YYYY*HH:mm');
    const fAuthor = author.raw.trim();
    const [fDate, fTime] = commitDate.split('*');

    return [fDate, message, fTime, fAuthor];
  });

  return formattedCommits.reverse();
};

const getCommitsForAllMonth = async () => {
  let commits: ICommit[] = [];
  const firstDateOfMonth = dayjs().startOf('month');

  const getNextChunkOfCommits = async (page = 1) => {
    const { values } = await getCommits(page);
    commits = [...commits, ...values];

    const lastDateOnPage = values[values.length - 1].date;
    if (firstDateOfMonth.isBefore(lastDateOnPage)) {
      page++;
      await getNextChunkOfCommits(page);
    } else {
      return commits;
    }
  };

  await getNextChunkOfCommits();

  return checkCommits(commits, NICK_NAME, firstDateOfMonth);
};

const getTodayCommits = async () => {
  let commits: ICommit[] = [];
  const currentDate = dayjs().startOf('day');

  const getNextChunkOfCommits = async (page = 1) => {
    const { values } = await getCommits(page);
    commits = [...commits, ...values];

    const lastDateOnPage = values[values.length - 1].date;
    if (currentDate.isAfter(lastDateOnPage)) {
      return commits;
    } else {
      page++;
      await getNextChunkOfCommits(page);
    }
  };

  await getNextChunkOfCommits();

  return checkCommits(commits, NICK_NAME, currentDate, true);
};

const getCommitsByDate = async (date: string) => {
  let commits: ICommit[] = [];
  const fDate = dayjs(date).startOf('day');

  const getNextChunkOfCommits = async (page = 1) => {
    const { values } = await getCommits(page);
    commits = [...commits, ...values];

    const lastDateOnPage = values[values.length - 1].date;
    if (fDate.isAfter(lastDateOnPage)) {
      return commits;
    } else {
      page++;
      await getNextChunkOfCommits(page);
    }
  };

  await getNextChunkOfCommits();

  return checkCommits(commits, NICK_NAME, fDate, true);
};

export const bitbucketAPI = {
  getCommitsForAllMonth,
  getTodayCommits,
  getCommitsByDate,
};
