/**
 * 설정 변수 interface
 */
export interface Configuration {
  readonly environment: 'development' | 'production';
  readonly server: ServerConfig;
  readonly cors: CorsConfig;
  readonly cookie: CookieConfig;
  readonly jwt: JwtConfig;
  readonly bcrypt: BcryptConfig;
  readonly mysql: MysqlConfig;
  readonly redis: RedisConfig;
  readonly openApi: OpenApiConfig;
}

/**
 * Nest Server 설정 변수
 */
export interface ServerConfig {
  readonly port: number;
  readonly host: string;
}

/**
 * CORS 설정 변수
 */
export interface CorsConfig {
  /**
   * Access-Control-Allow-Origin: ${origin}
   */
  readonly origin: string;

  /**
   * Access-Control-Allow-Credentials: true
   */
  readonly credentials: boolean;
}

/**
 * HTTP 쿠키 설정 변수
 */
export interface CookieConfig {
  /**
   * 쿠키명
   */
  readonly key: string;
  /**
   * 쿠키 암호화 키
   */
  readonly secret: string;
  /**
   * 쿠키 옵션
   */
  readonly options: CookieOption;
}

/**
 * JWT 토큰 설정 변수
 */
export interface JwtConfig {
  readonly access: JwtOption;
  readonly refresh: JwtOption;
}

/**
 * Bcrypt 설정 변수
 */
export interface BcryptConfig {
  readonly salt: number;
}

/**
 * MySQL 설정 변수
 */
export interface MysqlConfig {
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly username: string;
  readonly password: string;
}

/**
 * Redis 설정 변수
 */
export interface RedisConfig {
  readonly name: string;
  readonly url: string;
  readonly password: string;
}

/**
 * OpenAPI 설정 변수
 */
export interface OpenApiConfig {
  readonly gyeonggi: { bus: OpenApiOption; station: OpenApiOption };
  readonly seoul: { bus: OpenApiOption; station: OpenApiOption; metro: OpenApiOption };
  readonly holiday: OpenApiOption;
}

/**
 * http cookie 옵션
 */
export interface CookieOption {
  /**
   * 브라우저만 접근 가능(js로 접근불가)
   */
  readonly httpOnly: boolean;
  /**
   * 쿠키 암호화 사용 유무
   */
  readonly signed: boolean;
  /**
   * 쿠키를 적용할 도메인
   */
  readonly domain: string;
  /**
   * 쿠키를 적용할 도메인 하위 path
   */
  readonly path: string;
  /**
   * 만료일, refreshJwt와 동일하게 설정 **단위 ms(밀리세컨드)
   */
  readonly maxAge: number;
  /**
   * https에서만 사용가능한 쿠키로 설정
   */
  readonly secure: boolean;
  /**
   * - "strict": 서로 다른 도메인에서 전송 불가능.
   * - "lax": 서로 다른 도메인이지만 일부 예외( HTTP get method / a href / link href )에서는 전송 가능.
   * - "none": 모든 도메인에서 전송 가능 + https 환경 필수
   */
  readonly sameSite: boolean | 'lax' | 'strict' | 'none';
}

/**
 * JWT 옵션
 */
export interface JwtOption {
  /**
   * 암호화 키
   */
  readonly secret: string;
  /**
   * 만료일
   */
  readonly expiresIn: number;
  /**
   * 발행자
   */
  readonly issuer: string;
}

/**
 * Open APi 옵션
 */
export interface OpenApiOption {
  readonly host: string;
  readonly key: string;
  readonly arrival?: string | undefined;
}
