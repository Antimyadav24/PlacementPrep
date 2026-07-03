export const PATTERNS = [
  {
    name: "Arrays & Hashing",
    description: "Use Hash Maps to trade space for time. This pattern is foundational for quick lookups, counting frequencies, and finding duplicates in O(n) time."
  },
  {
    name: "Two Pointers",
    description: "Uses two pointers iterating through a data structure in tandem until they meet or hit a specific condition. Often used on sorted arrays to avoid O(n^2) nested loops."
  },
  {
    name: "Sliding Window",
    description: "Maintains a subset of elements (a 'window') that shifts over the data structure. Extremely effective for finding subarrays, substrings, or tracking metrics within a continuous range."
  },
  {
    name: "Stack",
    description: "LIFO (Last In First Out) structure. Useful for parsing parentheses, tracking previous smaller/greater elements (Monotonic Stack), and evaluating expressions."
  },
  {
    name: "Binary Search",
    description: "Halves the search space at every step. Used not just to find elements in a sorted array, but also to find the 'optimal' answer in a valid range."
  },
  {
    name: "Linked List",
    description: "Node-based sequences. Common techniques include the Fast & Slow pointer approach to detect cycles, and in-place pointer reversal."
  },
  {
    name: "Trees",
    description: "Hierarchical data. Solved mostly using DFS (recursion) for depth/path problems or BFS (queue) for level-order traversal problems."
  },
  {
    name: "Tries",
    description: "Prefix trees optimized for fast string matching and auto-complete features. Great for solving dictionary or prefix problems."
  },
  {
    name: "Backtracking",
    description: "Explores all possible combinations/permutations. Uses recursion to build a path and 'backtracks' when the path fails constraints."
  },
  {
    name: "Graphs",
    description: "Nodes connected by edges. Master DFS/BFS traversals, topological sorting, and union-find algorithms to solve real-world network problems."
  },
  {
    name: "Dynamic Programming",
    description: "Breaks a problem into overlapping subproblems. Trades memory for speed by memoizing previously calculated results."
  },
  {
    name: "Greedy",
    description: "Makes the locally optimal choice at each step to find a global optimum. Often requires sorting the data first."
  },
  {
    name: "Math & Geometry",
    description: "Algorithmic challenges based on mathematical theorems, bit manipulation, or spatial geometry."
  }
];

export const PATTERN_PROBLEMS = [
  // Arrays & Hashing
  { id: 'p1', num: 1, title: 'Two Sum', titleSlug: 'two-sum', difficulty: 'Easy', topic: 'Arrays & Hashing', status: 'UNSOLVED' },
  { id: 'p2', num: 242, title: 'Valid Anagram', titleSlug: 'valid-anagram', difficulty: 'Easy', topic: 'Arrays & Hashing', status: 'SOLVED' },
  { id: 'p3', num: 217, title: 'Contains Duplicate', titleSlug: 'contains-duplicate', difficulty: 'Easy', topic: 'Arrays & Hashing', status: 'SOLVED' },
  { id: 'p4', num: 49, title: 'Group Anagrams', titleSlug: 'group-anagrams', difficulty: 'Medium', topic: 'Arrays & Hashing', status: 'UNSOLVED' },
  { id: 'p5', num: 347, title: 'Top K Frequent Elements', titleSlug: 'top-k-frequent-elements', difficulty: 'Medium', topic: 'Arrays & Hashing', status: 'UNSOLVED' },
  { id: 'p36', num: 36, title: 'Valid Sudoku', titleSlug: 'valid-sudoku', difficulty: 'Medium', topic: 'Arrays & Hashing', status: 'UNSOLVED' },
  { id: 'p37', num: 37, title: 'Sudoku Solver', titleSlug: 'sudoku-solver', difficulty: 'Hard', topic: 'Arrays & Hashing', status: 'UNSOLVED' },
  { id: 'p31', num: 31, title: 'Next Permutation', titleSlug: 'next-permutation', difficulty: 'Medium', topic: 'Arrays & Hashing', status: 'UNSOLVED' },
  { id: 'p41', num: 41, title: 'First Missing Positive', titleSlug: 'first-missing-positive', difficulty: 'Hard', topic: 'Arrays & Hashing', status: 'UNSOLVED' },
  
  // Two Pointers
  { id: 'p6', num: 125, title: 'Valid Palindrome', titleSlug: 'valid-palindrome', difficulty: 'Easy', topic: 'Two Pointers', status: 'SOLVED' },
  { id: 'p7', num: 167, title: 'Two Sum II - Input Array Is Sorted', titleSlug: 'two-sum-ii-input-array-is-sorted', difficulty: 'Medium', topic: 'Two Pointers', status: 'UNSOLVED' },
  { id: 'p8', num: 15, title: '3Sum', titleSlug: '3sum', difficulty: 'Medium', topic: 'Two Pointers', status: 'UNSOLVED' },
  { id: 'p16_2', num: 16, title: '3Sum Closest', titleSlug: '3sum-closest', difficulty: 'Medium', topic: 'Two Pointers', status: 'UNSOLVED' },
  { id: 'p18', num: 18, title: '4Sum', titleSlug: '4sum', difficulty: 'Medium', topic: 'Two Pointers', status: 'UNSOLVED' },
  { id: 'p9', num: 11, title: 'Container With Most Water', titleSlug: 'container-with-most-water', difficulty: 'Medium', topic: 'Two Pointers', status: 'UNSOLVED' },
  { id: 'p26', num: 26, title: 'Remove Duplicates from Sorted Array', titleSlug: 'remove-duplicates-from-sorted-array', difficulty: 'Easy', topic: 'Two Pointers', status: 'UNSOLVED' },
  { id: 'p27', num: 27, title: 'Remove Element', titleSlug: 'remove-element', difficulty: 'Easy', topic: 'Two Pointers', status: 'UNSOLVED' },
  
  // Sliding Window
  { id: 'p10', num: 121, title: 'Best Time to Buy and Sell Stock', titleSlug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy', topic: 'Sliding Window', status: 'SOLVED' },
  { id: 'p11', num: 3, title: 'Longest Substring Without Repeating Characters', titleSlug: 'longest-substring-without-repeating-characters', difficulty: 'Medium', topic: 'Sliding Window', status: 'UNSOLVED' },
  { id: 'p12', num: 424, title: 'Longest Repeating Character Replacement', titleSlug: 'longest-repeating-character-replacement', difficulty: 'Medium', topic: 'Sliding Window', status: 'UNSOLVED' },
  { id: 'p30', num: 30, title: 'Substring with Concatenation of All Words', titleSlug: 'substring-with-concatenation-of-all-words', difficulty: 'Hard', topic: 'Sliding Window', status: 'UNSOLVED' },
  
  // Stack
  { id: 'p13', num: 20, title: 'Valid Parentheses', titleSlug: 'valid-parentheses', difficulty: 'Easy', topic: 'Stack', status: 'SOLVED' },
  { id: 'p14', num: 155, title: 'Min Stack', titleSlug: 'min-stack', difficulty: 'Medium', topic: 'Stack', status: 'UNSOLVED' },
  { id: 'p15', num: 739, title: 'Daily Temperatures', titleSlug: 'daily-temperatures', difficulty: 'Medium', topic: 'Stack', status: 'UNSOLVED' },
  
  // Binary Search
  { id: 'p16', num: 704, title: 'Binary Search', titleSlug: 'binary-search', difficulty: 'Easy', topic: 'Binary Search', status: 'SOLVED' },
  { id: 'p17', num: 74, title: 'Search a 2D Matrix', titleSlug: 'search-a-2d-matrix', difficulty: 'Medium', topic: 'Binary Search', status: 'UNSOLVED' },
  { id: 'p18_1', num: 33, title: 'Search in Rotated Sorted Array', titleSlug: 'search-in-rotated-sorted-array', difficulty: 'Medium', topic: 'Binary Search', status: 'UNSOLVED' },
  { id: 'p4', num: 4, title: 'Median of Two Sorted Arrays', titleSlug: 'median-of-two-sorted-arrays', difficulty: 'Hard', topic: 'Binary Search', status: 'UNSOLVED' },
  { id: 'p34', num: 34, title: 'Find First and Last Position of Element in Sorted Array', titleSlug: 'find-first-and-last-position-of-element-in-sorted-array', difficulty: 'Medium', topic: 'Binary Search', status: 'UNSOLVED' },
  { id: 'p35', num: 35, title: 'Search Insert Position', titleSlug: 'search-insert-position', difficulty: 'Easy', topic: 'Binary Search', status: 'UNSOLVED' },
  
  // Linked List
  { id: 'p19', num: 206, title: 'Reverse Linked List', titleSlug: 'reverse-linked-list', difficulty: 'Easy', topic: 'Linked List', status: 'SOLVED' },
  { id: 'p20', num: 21, title: 'Merge Two Sorted Lists', titleSlug: 'merge-two-sorted-lists', difficulty: 'Easy', topic: 'Linked List', status: 'UNSOLVED' },
  { id: 'p21', num: 143, title: 'Reorder List', titleSlug: 'reorder-list', difficulty: 'Medium', topic: 'Linked List', status: 'UNSOLVED' },
  { id: 'p22', num: 19, title: 'Remove Nth Node From End of List', titleSlug: 'remove-nth-node-from-end-of-list', difficulty: 'Medium', topic: 'Linked List', status: 'UNSOLVED' },

  // Trees
  { id: 'p23', num: 226, title: 'Invert Binary Tree', titleSlug: 'invert-binary-tree', difficulty: 'Easy', topic: 'Trees', status: 'UNSOLVED' },
  { id: 'p24', num: 104, title: 'Maximum Depth of Binary Tree', titleSlug: 'maximum-depth-of-binary-tree', difficulty: 'Easy', topic: 'Trees', status: 'UNSOLVED' },
  { id: 'p25', num: 102, title: 'Binary Tree Level Order Traversal', titleSlug: 'binary-tree-level-order-traversal', difficulty: 'Medium', topic: 'Trees', status: 'UNSOLVED' },

  // Tries
  { id: 'p14_1', num: 14, title: 'Longest Common Prefix', titleSlug: 'longest-common-prefix', difficulty: 'Easy', topic: 'Tries', status: 'UNSOLVED' },
  
  // Backtracking
  { id: 'p17_1', num: 17, title: 'Letter Combinations of a Phone Number', titleSlug: 'letter-combinations-of-a-phone-number', difficulty: 'Medium', topic: 'Backtracking', status: 'UNSOLVED' },
  { id: 'p39', num: 39, title: 'Combination Sum', titleSlug: 'combination-sum', difficulty: 'Medium', topic: 'Backtracking', status: 'UNSOLVED' },
  { id: 'p40', num: 40, title: 'Combination Sum II', titleSlug: 'combination-sum-ii', difficulty: 'Medium', topic: 'Backtracking', status: 'UNSOLVED' },

  // Math & Geometry
  { id: 'p12_1', num: 12, title: 'Integer to Roman', titleSlug: 'integer-to-roman', difficulty: 'Medium', topic: 'Math & Geometry', status: 'UNSOLVED' },
  { id: 'p13_1', num: 13, title: 'Roman to Integer', titleSlug: 'roman-to-integer', difficulty: 'Easy', topic: 'Math & Geometry', status: 'UNSOLVED' }
];
