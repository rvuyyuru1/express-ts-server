import { DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE } from '@/configs';

export const DatabaseOptions: {
  url: string;
  options: any;
} = {
  url: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}?retryWrites=true&w=majority`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
