// Test if the student profile page route works
console.log('Testing student profile page route...');

// Test URL that should work now:
const testUrl = '/departments/college/bsit/1st-year/block-c/2025-2026/68e2679de975ec87c5014c4e';

console.log('Test URL:', testUrl);

// Break down the URL parameters:
const urlParts = testUrl.split('/');
const params = {
  courseId: urlParts[3], // bsit
  yearId: urlParts[4],   // 1st-year
  blockId: urlParts[5],  // block-c
  schoolYear: urlParts[6], // 2025-2026
  studentId: urlParts[7]   // 68e2679de975ec87c5014c4e
};

console.log('URL parameters:', params);

// Test the validation logic:
console.log('\n--- Validation Test ---');

// Course validation (should pass)
const courseId = params.courseId;
const validCourses = ['bsit', 'bscs', 'beed', 'bsed', 'bshm', 'bsentrep', 'bped'];
const courseValid = validCourses.includes(courseId);
console.log('Course valid:', courseValid, `(${courseId})`);

// Year validation (should pass)
const yearId = params.yearId;
const validYears = ['1st-year', '2nd-year', '3rd-year', '4th-year'];
const yearValid = validYears.includes(yearId);
console.log('Year valid:', yearValid, `(${yearId})`);

// Block validation (should pass)
const blockId = params.blockId;
const validBlocks = ['block-a', 'block-b', 'block-c', 'block-d'];
const blockValid = validBlocks.includes(blockId);
console.log('Block valid:', blockValid, `(${blockId})`);

// Student ID validation (should pass - MongoDB ObjectId format)
const studentId = params.studentId;
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const studentIdValid = objectIdRegex.test(studentId);
console.log('Student ID valid:', studentIdValid, `(${studentId})`);

console.log('\nOverall validation:', courseValid && yearValid && blockValid && studentIdValid);

// Test the dynamic name generation:
const yearName = yearId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
const blockName = blockId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

console.log('\n--- Dynamic Names ---');
console.log('Year name:', yearName);
console.log('Block name:', blockName);
console.log('Back button text:', `Back to BSIT ${yearName} - ${blockName}`);
