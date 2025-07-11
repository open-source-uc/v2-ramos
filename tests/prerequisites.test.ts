import { describe, it, expect } from 'vitest';
import { parsePrerequisites } from '../src/lib/courseReq';

describe('parsePrerequisites', () => {
  it('should handle empty prerequisites', () => {
    expect(parsePrerequisites('')).toEqual({ hasPrerequisites: false });
    expect(parsePrerequisites('No tiene')).toEqual({ hasPrerequisites: false });
  });

  it('should parse single course', () => {
    expect(parsePrerequisites('(MAT1203)')).toEqual({
      hasPrerequisites: true,
      structure: {
        type: 'AND',
        courses: [{ sigle: 'MAT1203', isCoreq: false }]
      }
    });
  });

  it('should parse simple AND group', () => {
    expect(parsePrerequisites('(KIN203A y KIN313)')).toEqual({
      hasPrerequisites: true,
      structure: {
        type: 'AND',
        courses: [],
        groups: [
          {
            type: 'AND',
            courses: [{ sigle: 'KIN203A', isCoreq: false }]
          },
          {
            type: 'AND',
            courses: [{ sigle: 'KIN313', isCoreq: false }]
          }
        ]
      }
    });
  });

  it('should parse simple OR group', () => {
    expect(parsePrerequisites('(KIN203A o KIN313)')).toEqual({
      hasPrerequisites: true,
      structure: {
        type: 'OR',
        courses: [],
        groups: [
          {
            type: 'AND',
            courses: [{ sigle: 'KIN203A', isCoreq: false }]
          },
          {
            type: 'AND',
            courses: [{ sigle: 'KIN313', isCoreq: false }]
          }
        ]
      }
    });
  });

  it('should parse complex nested groups', () => {
    expect(parsePrerequisites('((MAT1203 y MAT1620) o (MAT1214 y MAT1620) o (IMT2220 y IMT2230)) y IIC1103')).toEqual({
      hasPrerequisites: true,
      structure: {
        type: 'AND',
        courses: [],
        groups: [
          {
            type: 'OR',
            courses: [],
            groups: [
              {
                type: 'AND',
                courses: [],
                groups: [
                  {
                    type: 'AND',
                    courses: [{ sigle: 'MAT1203', isCoreq: false }]
                  },
                  {
                    type: 'AND',
                    courses: [{ sigle: 'MAT1620', isCoreq: false }]
                  }
                ]
              },
              {
                type: 'AND',
                courses: [],
                groups: [
                  {
                    type: 'AND',
                    courses: [{ sigle: 'MAT1214', isCoreq: false }]
                  },
                  {
                    type: 'AND',
                    courses: [{ sigle: 'MAT1620', isCoreq: false }]
                  }
                ]
              },
              {
                type: 'AND',
                courses: [],
                groups: [
                  {
                    type: 'AND',
                    courses: [{ sigle: 'IMT2220', isCoreq: false }]
                  },
                  {
                    type: 'AND',
                    courses: [{ sigle: 'IMT2230', isCoreq: false }]
                  }
                ]
              }
            ]
          },
          {
            type: 'AND',
            courses: [{ sigle: 'IIC1103', isCoreq: false }]
          }
        ]
      }
    });
  });

  it('should parse OR between AND groups', () => {
    expect(parsePrerequisites('(KIN203A y KIN313) o (KIN203 y KIN313)')).toEqual({
      hasPrerequisites: true,
      structure: {
        type: 'OR',
        courses: [],
        groups: [
          {
            type: 'AND',
            courses: [],
            groups: [
              {
                type: 'AND',
                courses: [{ sigle: 'KIN203A', isCoreq: false }]
              },
              {
                type: 'AND',
                courses: [{ sigle: 'KIN313', isCoreq: false }]
              }
            ]
          },
          {
            type: 'AND',
            courses: [],
            groups: [
              {
                type: 'AND',
                courses: [{ sigle: 'KIN203', isCoreq: false }]
              },
              {
                type: 'AND',
                courses: [{ sigle: 'KIN313', isCoreq: false }]
              }
            ]
          }
        ]
      }
    });
  });

  it('should handle corequisites', () => {
    expect(parsePrerequisites('(MAT1203(c))')).toEqual({
      hasPrerequisites: true,
      structure: {
        type: 'AND',
        courses: [{ sigle: 'MAT1203', isCoreq: true }]
      }
    });
  });
}); 