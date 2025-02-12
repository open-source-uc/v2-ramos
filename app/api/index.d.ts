declare const app: import("@hono/zod-openapi").OpenAPIHono<
  {
    Bindings: import("./lib/honoBase").Bindings;
  },
  {},
  "/"
>;
declare const routes: import("@hono/zod-openapi").OpenAPIHono<
  {
    Bindings: import("./lib/honoBase").Bindings;
  },
  import("hono/types").MergeSchemaPath<
    {
      "/list": {
        $get:
          | {
              input: {};
              output: {
                permissions: {
                  id: number;
                  permission_name: string;
                }[];
              };
              outputFormat: "json";
              status: 200;
            }
          | {
              input: {};
              output: {
                message: string;
              };
              outputFormat: "json";
              status: 500;
            };
      };
    } & {
      "/": {
        $get:
          | {
              input: {};
              output: {
                users: {
                  password: string;
                  nickname: string;
                  admission_year: number;
                  email_hash: string;
                  career_id: number;
                  token_version: string;
                }[];
              };
              outputFormat: "json";
              status: 200;
            }
          | {
              input: {};
              output: {
                message: string;
              };
              outputFormat: "json";
              status: 404;
            }
          | {
              input: {};
              output: {
                message: string;
              };
              outputFormat: "json";
              status: 500;
            };
      };
    } & {
      "/:email": {
        $get:
          | {
              input: {
                param: {
                  email: string;
                };
              };
              output: {
                user: {
                  password: string;
                  nickname: string;
                  admission_year: number;
                  email_hash: string;
                  career_id: number;
                  token_version: string;
                };
              };
              outputFormat: "json";
              status: 200;
            }
          | {
              input: {
                param: {
                  email: string;
                };
              };
              output: {
                message: string;
              };
              outputFormat: "json";
              status: 404;
            }
          | {
              input: {
                param: {
                  email: string;
                };
              };
              output: {
                message: string;
              };
              outputFormat: "json";
              status: 500;
            };
      };
    },
    "/admin/user/manager"
  > &
    import("hono/types").MergeSchemaPath<
      {
        "/:email_hash": {
          $get:
            | {
                input: {
                  param: {
                    email_hash: string;
                  };
                };
                output: {
                  permissions: {
                    permission_id: number;
                  }[];
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  param: {
                    email_hash: string;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/": {
          $post:
            | {
                input: {
                  json: {
                    email_hash: string;
                    permission_id: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 201;
              }
            | {
                input: {
                  json: {
                    email_hash: string;
                    permission_id: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/": {
          $delete:
            | {
                input: {
                  json: {
                    email_hash: string;
                    permission_id: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  json: {
                    email_hash: string;
                    permission_id: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      },
      "/admin/user/permission"
    > &
    import("hono/types").MergeSchemaPath<
      {
        "/course": {
          $post:
            | {
                input: {
                  json: {
                    name: string;
                    school_id: number;
                    sigle: string;
                    category_id: number;
                    area_id: number;
                    credits: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 201;
              }
            | {
                input: {
                  json: {
                    name: string;
                    school_id: number;
                    sigle: string;
                    category_id: number;
                    area_id: number;
                    credits: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      },
      "/bots"
    > &
    import("hono/types").MergeSchemaPath<
      {
        "/": {
          $post:
            | {
                input: {
                  json: {
                    course_id: number;
                    year: number;
                    section_number: number;
                    liked: boolean;
                    comment: string;
                    estimated_credits: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 400;
              }
            | {
                input: {
                  json: {
                    course_id: number;
                    year: number;
                    section_number: number;
                    liked: boolean;
                    comment: string;
                    estimated_credits: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 201;
              }
            | {
                input: {
                  json: {
                    course_id: number;
                    year: number;
                    section_number: number;
                    liked: boolean;
                    comment: string;
                    estimated_credits: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/": {
          $put:
            | {
                input: {
                  json: {
                    course_id: number;
                    year: number;
                    section_number: number;
                    liked: boolean;
                    comment: string;
                    estimated_credits: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 400;
              }
            | {
                input: {
                  json: {
                    course_id: number;
                    year: number;
                    section_number: number;
                    liked: boolean;
                    comment: string;
                    estimated_credits: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  json: {
                    course_id: number;
                    year: number;
                    section_number: number;
                    liked: boolean;
                    comment: string;
                    estimated_credits: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 404;
              }
            | {
                input: {
                  json: {
                    course_id: number;
                    year: number;
                    section_number: number;
                    liked: boolean;
                    comment: string;
                    estimated_credits: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/": {
          $delete:
            | {
                input: {
                  json: {
                    course_id: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  json: {
                    course_id: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 404;
              }
            | {
                input: {
                  json: {
                    course_id: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      },
      "/user/reviews"
    > &
    import("hono/types").MergeSchemaPath<
      {
        "/": {
          $get:
            | {
                input: {};
                output: {
                  user: {
                    nickname: string;
                    admission_year: number;
                    career_id: number;
                  } | null;
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {};
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/": {
          $put:
            | {
                input: {
                  json: {
                    nickname: string;
                    admission_year: number;
                    career_id: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 400;
              }
            | {
                input: {
                  json: {
                    nickname: string;
                    admission_year: number;
                    career_id: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  json: {
                    nickname: string;
                    admission_year: number;
                    career_id: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/": {
          $patch:
            | {
                input: {
                  json: {
                    currentPassword: string;
                    newPassword: string;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 400;
              }
            | {
                input: {
                  json: {
                    currentPassword: string;
                    newPassword: string;
                  };
                };
                output: {
                  message: string;
                  token: string;
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  json: {
                    currentPassword: string;
                    newPassword: string;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 401;
              }
            | {
                input: {
                  json: {
                    currentPassword: string;
                    newPassword: string;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 404;
              }
            | {
                input: {
                  json: {
                    currentPassword: string;
                    newPassword: string;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      },
      "/user/panel"
    > &
    import("hono/types").MergeSchemaPath<
      {
        "/": {
          $get:
            | {
                input: {
                  query: {
                    review_id_start?: string | undefined;
                  };
                };
                output: {
                  reviews: {
                    date: string;
                    nickname: string;
                    id: number;
                    course_id: number;
                    year: number;
                    section_number: number;
                    liked: boolean;
                    comment: string;
                    estimated_credits: number;
                  }[];
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  query: {
                    review_id_start?: string | undefined;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 404;
              }
            | {
                input: {
                  query: {
                    review_id_start?: string | undefined;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/course/:course_id": {
          $get:
            | {
                input: {
                  param: {
                    course_id: string;
                  };
                } & {
                  query: {
                    review_id_start?: string | undefined;
                  };
                };
                output: {
                  reviews: {
                    date: string;
                    nickname: string;
                    id: number;
                    course_id: number;
                    year: number;
                    section_number: number;
                    liked: boolean;
                    comment: string;
                    estimated_credits: number;
                  }[];
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  param: {
                    course_id: string;
                  };
                } & {
                  query: {
                    review_id_start?: string | undefined;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 404;
              }
            | {
                input: {
                  param: {
                    course_id: string;
                  };
                } & {
                  query: {
                    review_id_start?: string | undefined;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/course/:course_id/:nickname": {
          $get:
            | {
                input: {
                  param: {
                    nickname: string;
                    course_id: string;
                  };
                };
                output: {
                  reviews: {
                    date: string;
                    nickname: string;
                    id: number;
                    course_id: number;
                    year: number;
                    section_number: number;
                    liked: boolean;
                    comment: string;
                    estimated_credits: number;
                  };
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  param: {
                    nickname: string;
                    course_id: string;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 404;
              }
            | {
                input: {
                  param: {
                    nickname: string;
                    course_id: string;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/user/:nickname": {
          $get:
            | {
                input: {
                  param: {
                    nickname: string;
                  };
                } & {
                  query: {
                    review_id_start?: string | undefined;
                  };
                };
                output: {
                  reviews: {
                    date: string;
                    nickname: string;
                    id: number;
                    course_id: number;
                    year: number;
                    section_number: number;
                    liked: boolean;
                    comment: string;
                    estimated_credits: number;
                  }[];
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  param: {
                    nickname: string;
                  };
                } & {
                  query: {
                    review_id_start?: string | undefined;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 404;
              }
            | {
                input: {
                  param: {
                    nickname: string;
                  };
                } & {
                  query: {
                    review_id_start?: string | undefined;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      },
      "/reviews"
    > &
    import("hono/types").MergeSchemaPath<
      {
        "/career": {
          $get:
            | {
                input: {};
                output: {
                  career: {
                    name: string;
                    id: number;
                  }[];
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {};
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/school": {
          $get:
            | {
                input: {};
                output: {
                  schools: {
                    id: number;
                    school: string;
                  }[];
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {};
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/category": {
          $get:
            | {
                input: {};
                output: {
                  categorys: {
                    id: number;
                    category: string;
                  }[];
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {};
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/area": {
          $get:
            | {
                input: {};
                output: {
                  areas: {
                    id: number;
                    area: string;
                  }[];
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {};
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      },
      "/general"
    > &
    import("hono/types").MergeSchemaPath<
      {
        "/register": {
          $post:
            | {
                input: {
                  json: {
                    password: string;
                    nickname: string;
                    admission_year: number;
                    email: string;
                    career_id: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 400;
              }
            | {
                input: {
                  json: {
                    password: string;
                    nickname: string;
                    admission_year: number;
                    email: string;
                    career_id: number;
                  };
                };
                output: {
                  nickname: string;
                  token: string;
                };
                outputFormat: "json";
                status: 201;
              }
            | {
                input: {
                  json: {
                    password: string;
                    nickname: string;
                    admission_year: number;
                    email: string;
                    career_id: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 409;
              }
            | {
                input: {
                  json: {
                    password: string;
                    nickname: string;
                    admission_year: number;
                    email: string;
                    career_id: number;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/login": {
          $post:
            | {
                input: {
                  json: {
                    password: string;
                    email: string;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 400;
              }
            | {
                input: {
                  json: {
                    password: string;
                    email: string;
                  };
                };
                output: {
                  nickname: string;
                  token: string;
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  json: {
                    password: string;
                    email: string;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 401;
              }
            | {
                input: {
                  json: {
                    password: string;
                    email: string;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      },
      "/auth"
    > &
    import("hono/types").MergeSchemaPath<
      {
        "/": {
          $get:
            | {
                input: {
                  query: {
                    start_promedio?: string | undefined;
                    school_id?: string | undefined;
                  };
                };
                output: {
                  courses: {
                    name: string;
                    school_id: number;
                    course_id: number;
                    sigle: string;
                    category_id: number;
                    area_id: number;
                    credits: number;
                    promedio: number;
                    promedio_creditos_est: number;
                  }[];
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  query: {
                    start_promedio?: string | undefined;
                    school_id?: string | undefined;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/ofg": {
          $get:
            | {
                input: {
                  query: {
                    area_id: string;
                    start_promedio?: string | undefined;
                  };
                };
                output: {
                  courses: {
                    name: string;
                    school_id: number;
                    course_id: number;
                    sigle: string;
                    category_id: number;
                    area_id: number;
                    credits: number;
                    promedio: number;
                    promedio_creditos_est: number;
                  }[];
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  query: {
                    area_id: string;
                    start_promedio?: string | undefined;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/course_id/:course_id": {
          $get:
            | {
                input: {
                  param: {
                    course_id: string;
                  };
                };
                output: {
                  course: {
                    name: string;
                    school_id: number;
                    course_id: number;
                    sigle: string;
                    category_id: number;
                    area_id: number;
                    credits: number;
                    promedio: number;
                    promedio_creditos_est: number;
                  };
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  param: {
                    course_id: string;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 404;
              }
            | {
                input: {
                  param: {
                    course_id: string;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/sigle/:sigle": {
          $get:
            | {
                input: {
                  param: {
                    sigle: string;
                  };
                };
                output: {
                  course: {
                    name: string;
                    school_id: number;
                    course_id: number;
                    sigle: string;
                    category_id: number;
                    area_id: number;
                    credits: number;
                    promedio: number;
                    promedio_creditos_est: number;
                  };
                };
                outputFormat: "json";
                status: 200;
              }
            | {
                input: {
                  param: {
                    sigle: string;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 404;
              }
            | {
                input: {
                  param: {
                    sigle: string;
                  };
                };
                output: {
                  message: string;
                };
                outputFormat: "json";
                status: 500;
              };
        };
      },
      "/course"
    >,
  "/"
>;
export default app;
export type AppType = typeof routes;
