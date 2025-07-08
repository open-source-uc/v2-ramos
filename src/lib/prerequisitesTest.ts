import { parsePrerequisites } from '@/lib/courseReq';

// Test cases for the prerequisites parser
const testCases = [
  // Simple cases
  'No tiene',
  'MAT1124',
  'MAT1124(c)',
  
  // OR cases
  'MAT1124 o MAT1126',
  'MAT0004 o MAT0006 o MAT0007',
  
  // AND cases
  'MAT1124 y MAT1126',
  
  // Complex cases
  '(MAT1124 o MAT1126) y (MAT0004 o MAT0006 o MAT0007)',
  '(MAT1124 o MAT1126) y (MAT0004 o MAT0006 o MAT0007) o (IMT2220 o IMT2230)',
  
  // Mixed with corricular
  'MAT1124(c) y (MAT0004 o MAT0006)',
  '(MAT1124(c) o MAT1126) y MAT0007',
  
  // Nested parentheses
  '((MAT1124 o MAT1126) y MAT0004) o (MAT0006 y MAT0007)',
];

console.log('Prerequisites Parser Test Results:');
console.log('=====================================');

testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. Input: "${testCase}"`);
  console.log('   Output:', JSON.stringify(parsePrerequisites(testCase), null, 2));
});

// Example usage function
export function getPrerequisitesDisplayText(req: string): string {
  const parsed = parsePrerequisites(req);
  
  if (!parsed.hasPrerequisites) {
    return 'No tiene prerrequisitos';
  }
  
  if (!parsed.structure) {
    return 'Error al procesar prerrequisitos';
  }
  
  return formatPrerequisiteGroup(parsed.structure);
}

function formatPrerequisiteGroup(group: any): string {
  const parts: string[] = [];
  
  // Add courses
  if (group.courses && group.courses.length > 0) {
    const courseTexts = group.courses.map((course: any) => 
      `${course.sigle}${course.isCorricular ? '(c)' : ''}`
    );
    parts.push(courseTexts.join(group.type === 'AND' ? ' y ' : ' o '));
  }
  
  // Add nested groups
  if (group.groups && group.groups.length > 0) {
    const groupTexts = group.groups.map((subGroup: any) => 
      `(${formatPrerequisiteGroup(subGroup)})`
    );
    parts.push(groupTexts.join(group.type === 'AND' ? ' y ' : ' o '));
  }
  
  return parts.join(group.type === 'AND' ? ' y ' : ' o ');
}
