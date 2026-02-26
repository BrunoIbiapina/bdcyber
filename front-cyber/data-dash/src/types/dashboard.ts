export type TimeSeriesPoint = {
  date: string;
  value: number;
};

export type TopCategory = {
  category: string;
  value: number;
};

  start: Date | string | dayjs.Dayjs | null;
  end: Date | string | dayjs.Dayjs | null;
  freq: 'D' | 'W' | 'M';
  categorias: string[];
  topN: number;
};
