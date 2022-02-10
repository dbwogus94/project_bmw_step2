import { Configuration } from './config.interface';

/**
 * process.env에서 key에 해당하는 값이 있는지 검사한다.
 * @param key - 환경변수 key 값
 * @param defaultValue - key에 해당하는 값이 없을 경우 넣을 값
 * @returns
 * @throws
 * - 필수 환경변수가 없으면 에러를 던진다
 */
export function required(key: string | number, defaultValue: any = undefined): string {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`key ${key} is undefined`);
  }
  return value + '';
}

/**
 * Configuration 타입의 객체를 리턴
 * - readOnly
 * @returns
 */
export const getConfiguration = (): Configuration =>
  Object.freeze({
    environment: required('NODE_ENV', 'development') === 'development' ? 'development' : 'production',
    server: {
      port: Number(required('PORT', '8080')),
      host: required('HOST', 'localhost'),
    },
    cors: {
      // 다른 도메인 쿠키를 공유하기 위한 설정 => true 또는 구체적인 도메인을 넣는다,
      // 와일드 카드("*") 사용불가
      origin: required('CORS_ORIGIN'), // === Access-Control-Allow-Origin: ${origin}
      credentials: true, // === Access-Control-Allow-Credentials: true
    },
    cookie: {
      // 쿠키명
      key: required('COOKIE_KEY'),
      // cookieParser에 적용할 쿠키 암호화 키
      secret: required('COOKIE_SECRET'),
      options: {
        // 스크립트 접근 불가
        httpOnly: true,
        // 쿠키 암호화
        signed: true,
        // 쿠키를 적용할 도메인
        domain: required('COOKIE_DOMAIN'),
        // 쿠키를 적용할 도메인 path
        path: required('COOKIE_PATH'),
        // 만료일, refreshJwt와 동일하게 설정 **단위 ms(밀리세컨드)
        maxAge: Number(required('JWT_REFRESH_TOKEN_EXPIRATION_TIME', '1209600')) * 1000, // 14d
        // https에서만 유효, **booean형으로 리턴되게 해야한다.
        secure: required('COOKIE_SECURE') === 'true',
        // "none" : 쿠키 모든 도메인에서 전송 가능, https에서만 작동한다.
        sameSite: required('COOKIE_SAMESITE', false) === 'none' ? 'none' : false,
      },
    },
    jwt: {
      access: {
        secret: required('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: Number(required('JWT_ACCESS_TOKEN_EXPIRATION_TIME', '3600')), // 1h
        issuer: required('JWT_ISSUER'),
      },
      refresh: {
        secret: required('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: Number(required('JWT_REFRESH_TOKEN_EXPIRATION_TIME', '1209600')), // 14d
        issuer: required('JWT_ISSUER'),
      },
    },
    bcrypt: {
      salt: Number(required('BCRYPT_SALT', '10')),
    },
    mysql: {
      host: required('DB_HOST', 'localhost'),
      port: Number(required('DB_PORT', '13306')),
      database: required('DB_DATABASE'),
      username: required('DB_USERNAME', 'root'),
      password: required('DB_PASSWORD'),
    },
    redis: {
      name: required('REDIS_NAME'),
      url: required('REDIS_URL'),
      password: required('REDIS_PASSWORD'),
    },
    openApi: {
      gyeonggi: {
        bus: {
          host: required('GYEONGGI_BUS_HOST'),
          arrival: required('GYEONGGI_BUS_ARRIVAL_HOST'),
          key: required('GYEONGGI_BUS_KEY'),
        },
        station: {
          host: required('GYEONGGI_STATION_HOST'),
          key: required('GYEONGGI_STATION_KEY'),
        },
      },
      seoul: {
        bus: {
          host: required('SEOUL_BUS_HOST'),
          arrival: required('SEOUL_BUS_ARRIVAL_HOST'),
          key: required('SEOUL_BUS_KEY'),
        },
        station: {
          host: required('SEOUL_STATION_HOST'),
          key: required('SEOUL_STATION_KEY'),
        },
        metro: {
          host: required('SEOUL_METRO_OPEN_API_HOST'),
          key: required('SEOUL_METRO_OPEN_API_KEY'),
        },
      },
      holiday: {
        host: required('KOREA_HOLIDAY_HOST'),
        key: required('KOREA_HOLIDAY_KEY'),
      },
    },
  });
