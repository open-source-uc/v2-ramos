import { describe, it, expect } from 'vitest';
import { parsePrerequisites } from '../src/lib/courseReq';
import { getAllCourseDependencies } from '../src/lib/server/courseDependencies';

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

describe('getAllCourseDependencies', () => {
  it('should return empty array for course with no prerequisites', async () => {
    // Create mock course data
    const coursesMap = new Map([
      ['TEST001', { sigle: 'TEST001', req: 'No tiene' }]
    ]);
    
    const result = await getAllCourseDependencies('TEST001', coursesMap);
    expect(result).toEqual([]);
  });

  it('should return direct prerequisites for simple case', async () => {
    const coursesMap = new Map([
      ['TEST002', { sigle: 'TEST002', req: '(TEST001)' }],
      ['TEST001', { sigle: 'TEST001', req: 'No tiene' }]
    ]);
    
    const result = await getAllCourseDependencies('TEST002', coursesMap);
    expect(result).toEqual(['TEST001']);
  });

  it('should return all nested dependencies', async () => {
    const coursesMap = new Map([
      ['TEST003', { sigle: 'TEST003', req: '(TEST002)' }],
      ['TEST002', { sigle: 'TEST002', req: '(TEST001)' }],
      ['TEST001', { sigle: 'TEST001', req: 'No tiene' }]
    ]);
    
    const result = await getAllCourseDependencies('TEST003', coursesMap);
    expect(result).toEqual(['TEST001', 'TEST002']);
  });

  it('should handle multiple prerequisites and avoid duplicates', async () => {
    const coursesMap = new Map([
      ['TEST004', { sigle: 'TEST004', req: '(TEST001 y TEST002)' }],
      ['TEST005', { sigle: 'TEST005', req: '(TEST001 y TEST003)' }],
      ['TEST006', { sigle: 'TEST006', req: '(TEST004 y TEST005)' }],
      ['TEST001', { sigle: 'TEST001', req: 'No tiene' }],
      ['TEST002', { sigle: 'TEST002', req: 'No tiene' }],
      ['TEST003', { sigle: 'TEST003', req: 'No tiene' }]
    ]);
    
    const result = await getAllCourseDependencies('TEST006', coursesMap);
    expect(result.sort()).toEqual(['TEST001', 'TEST002', 'TEST003', 'TEST004', 'TEST005']);
  });

  it('should handle circular dependencies gracefully', async () => {
    const coursesMap = new Map([
      ['CIRCULAR1', { sigle: 'CIRCULAR1', req: '(CIRCULAR2)' }],
      ['CIRCULAR2', { sigle: 'CIRCULAR2', req: '(CIRCULAR1)' }]
    ]);
    
    const result = await getAllCourseDependencies('CIRCULAR1', coursesMap);
    // In a circular dependency, the function should detect it and not include the starting course
    expect(result).toEqual(['CIRCULAR2']);
  });

  it('should return empty array for non-existent course', async () => {
    const coursesMap = new Map([
      ['TEST001', { sigle: 'TEST001', req: 'No tiene' }]
    ]);
    
    const result = await getAllCourseDependencies('NONEXISTENT', coursesMap);
    expect(result).toEqual([]);
  });
}); 