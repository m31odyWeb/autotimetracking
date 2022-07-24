export interface ICommit {
  type: string;
  hash: string;
  date: string;
  author: {
    type: string;
    raw: string;
    user: {
      display_name: string;
      links: Partial<ICommitLinks>;
      type: string;
      uuid: string;
      account_id: string;
      nickname: string;
    };
  };
  message: string;
  summary: {
    type: string;
    raw: string;
    markup: string;
    html: string;
  };
  links: Partial<ICommitLinks>;
  parents: {
    type: string;
    hash: string;
    links: Partial<ICommitLinks>;
  }[];
  rendered: {
    message: {
      type: string;
      raw: string;
      markup: string;
      html: string;
    };
  };
  repository: {
    type: string;
    full_name: string;
    name: string;
    uuid: string;
    links: Partial<ICommitLinks>;
  };
}
interface ICommitLinks {
  self: Href;
  html: Href;
  avatar: Href;
  diff: Href;
  aprove: Href;
  comments: Href;
  statuses: Href;
}
interface Href {
  href: string;
}

export interface IGetCommitsRes {
  values: ICommit[];
  pagelen: number;
  next: string;
}
