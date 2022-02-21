import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file'; // 날짜별로 윈스턴 로그 저장 기능을 지원하는 모듈
import { utilities } from 'nest-winston';
import { join, sep } from 'path';

// TODO: Nest config 설정보다 winston 로거가 먼저 생성된다. 때문에 값을 일단 하드코딩 하였다.
// 1. Nest 부트스트레핑 시점에 윈스턴 로거를 사용해야한다.
// 2. Nest는 부트스트래핑 사이클중 ConfigModule 초기화 시점에 env 파일을 읽는다.
// 즉, 아래 설정 값을 env에서 읽어서 적용하게 하려면 추가적인 설정이 있어야 한다.
const logLable = 'BMW2_api';
const baseDir = '.' + sep + 'logs'; // ./logs
const errLogDir = join(baseDir, 'error'); // ./logs/error

/**
 * winston에 설정할 커스텀 로그 우선순위 목록 정의
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  // http: 3, -> http log는 따로 Morgan을 사용하여 설정
  verbose: 4,
  debug: 5,
  silly: 6,
};

/**
 * 개발 환경 로그 저장위치 설정 => 콘솔에 출력
 * @returns
 */
const devTransports = () => [new winston.transports.Console()];

/**
 * 운영 환경 로그 저장 위치 설정
 * @returns
 */
const transports = () => [
  /* info 레벨 로그를 저장할 파일 설정 */
  new winstonDaily({
    level: 'info',
    datePattern: 'YYYY-MM-DD', // 파일명 날짜 형식 패턴
    dirname: baseDir, // 저장 위치
    filename: `%DATE%.log`, // ex) 2021-12-11.log
    maxFiles: 30, // 30일치 로그 파일 저장
    zippedArchive: true, // 30일이 지난 로그는 압축하도록 설정.
  }),
  /* error 레벨 로그를 저장할 파일 설정 */
  new winstonDaily({
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: errLogDir,
    filename: `%DATE%.error.log`,
    maxFiles: 30,
    zippedArchive: true,
  }),
];

/**
 * WinstonModule.createLogger()에 인자로 전달할 설정 값
 */
export default {
  /* 커스텀 레벨 목록 설정 */
  levels,
  /* 설정한 로그 레벨 이하만 출력 */
  level:
    process.env.NODE_ENV === 'production' //
      ? 'info'
      : 'silly',
  /* 출력 포멧 설정: nest-winston에서 제공하는 포멧 사용 */
  format: winston.format.combine(
    winston.format.timestamp(),
    utilities.format.nestLike(logLable, { prettyPrint: true }),
  ),
  /* 생성한 로그를 어디에 출력(전송)할지 설정 */
  transports:
    process.env.NODE_ENV === 'production' //
      ? transports() // 파일에 저장
      : devTransports(), // 콘솔 출력
};
