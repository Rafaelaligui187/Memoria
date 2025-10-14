// Test the URL generation for profile links
console.log('Testing URL generation for profile links...');

// Based on the image, the current page parameters would be:
const params = {
  courseId: 'bsit',
  yearId: '1st-year', 
  blockId: 'block-c',
  schoolYear: '2025-2026'
};

// The profileBasePath would be:
const profileBasePath = `/departments/college/${params.courseId}/${params.yearId}/${params.blockId}/${params.schoolYear}`;

console.log('Profile base path:', profileBasePath);

// For Austine's profile (ID: 68e2679de975ec87c5014c4e), the full URL would be:
const austineId = '68e2679de975ec87c5014c4e';
const austineProfileUrl = `${profileBasePath}/${austineId}`;

console.log('Austine\'s profile URL:', austineProfileUrl);

// Expected URL structure based on the file path:
// app/departments/college/[courseId]/[yearId]/[blockId]/[schoolYear]/[studentId]/page.tsx
const expectedUrl = `/departments/college/bsit/1st-year/block-c/2025-2026/68e2679de975ec87c5014c4e`;

console.log('Expected URL structure:', expectedUrl);
console.log('URLs match:', austineProfileUrl === expectedUrl);

// Let's also check what the actual route file expects:
console.log('\nRoute file expects:');
console.log('- courseId: CourseId (bsit, bscs, beed, bsed, bshm, bsentrep, bped)');
console.log('- yearId: YearId (1st-year, 2nd-year, 3rd-year, 4th-year)');
console.log('- blockId: BlockId (block-a, block-b, block-c, etc.)');
console.log('- schoolYear: string (2025-2026)');
console.log('- studentId: string (MongoDB ObjectId)');
