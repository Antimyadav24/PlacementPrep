package com.placeprep.portal.component;

import com.placeprep.portal.models.*;
import com.placeprep.portal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    TestResultRepository testResultRepository;

    @Autowired
    StudyMaterialRepository studyMaterialRepository;

    @Autowired
    MockTestRepository mockTestRepository;

    @Autowired
    CodingProblemRepository codingProblemRepository;

    @Autowired
    InterviewResourceRepository interviewResourceRepository;

    @Autowired
    BulkQuestionSeeder bulkQuestionSeeder;

    @Autowired
    BulkContentSeeder bulkContentSeeder;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            Role userRole = new Role();
            userRole.setName(ERole.ROLE_USER);
            roleRepository.save(userRole);

            Role adminRole = new Role();
            adminRole.setName(ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);
        }

        if (!userRepository.findByEmail("antimayadav917062@gmail.com").isPresent()) {
            User admin = new User("Antima Yadav", "antimayadav917062@gmail.com", "admin123", "PlacePrep Institute", "CSE");
            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByName(ERole.ROLE_ADMIN).orElseThrow(() -> new RuntimeException("Role Admin not found")));
            roles.add(roleRepository.findByName(ERole.ROLE_USER).orElseThrow(() -> new RuntimeException("Role User not found")));
            admin.setRoles(roles);
            userRepository.save(admin);
        }

        bulkQuestionSeeder.seedIfNeeded();
        bulkContentSeeder.seedResourcesIfNeeded();
        bulkContentSeeder.seedCodingIfNeeded();
        bulkContentSeeder.seedInterviewIfNeeded();
        bulkContentSeeder.seedAnnouncementsIfNeeded();

        if (mockTestRepository.count() == 0) {
            seedMockTests();
        }
    }

    private void seedQuestions() {
        List<Question> qList = new ArrayList<>();

        // ==================== TECHNICAL: CORE-JAVA (7 questions) ====================
        qList.add(new Question(
            "Which of the following statements is true about garbage collection in Java?",
            "Garbage collection can be forced by calling System.gc()",
            "Garbage collection runs on a high priority thread",
            "Destructors are used to reclaim memory",
            "Garbage collection reclaims memory of objects that are no longer reachable",
            "D",
            "In Java, the garbage collector runs as a low-priority background thread and reclaims memory occupied by objects that have no active references (are unreachable). Calling System.gc() only suggests execution but does not guarantee it.",
            "core-java", "Medium", "TECHNICAL"
        ));

        qList.add(new Question(
            "What is the difference between fail-fast and fail-safe iterators in Java?",
            "Fail-fast throws ConcurrentModificationException if collection is modified, fail-safe doesn't",
            "Fail-safe throws ConcurrentModificationException, fail-fast doesn't",
            "Fail-fast works on a clone of the collection",
            "There is no difference",
            "A",
            "Fail-fast iterators (like ArrayList's iterator) throw ConcurrentModificationException immediately if the collection is modified while iterating. Fail-safe iterators (like ConcurrentHashMap's iterator) work on a clone of the collection and do not throw this exception.",
            "core-java", "Medium", "TECHNICAL"
        ));

        qList.add(new Question(
            "Which of the following is NOT a valid access modifier in Java?",
            "private",
            "protected",
            "internal",
            "public",
            "C",
            "Java has private, default (package-private), protected, and public access modifiers. 'internal' is a keyword in C# and Kotlin, not Java.",
            "core-java", "Easy", "TECHNICAL"
        ));

        qList.add(new Question(
            "What is the output of 'System.out.println(10 + 20 + \"Java\");' and 'System.out.println(\"Java\" + 10 + 20);'?",
            "30Java and Java30",
            "30Java and Java1020",
            "1020Java and Java30",
            "1020Java and Java1020",
            "B",
            "Evaluation goes left to right. In 10 + 20 + \"Java\", 10 and 20 are added (30), then concatenated with \"Java\" (30Java). In \"Java\" + 10 + 20, \"Java\" is concatenated with 10 (\"Java10\") and then with 20 (\"Java1020\").",
            "core-java", "Medium", "TECHNICAL"
        ));

        qList.add(new Question(
            "How can you make a class immutable in Java?",
            "Make the class final and all its fields private and final",
            "Do not provide setter methods",
            "Perform deep copy for mutable object references in constructors and getters",
            "All of the above",
            "D",
            "To create an immutable class: declare the class as final, make fields private and final, do not provide setters, and perform deep copy for mutable members so clients cannot modify their internal state.",
            "core-java", "Hard", "TECHNICAL"
        ));

        qList.add(new Question(
            "Which class in Java is the superclass of all classes?",
            "Object",
            "Class",
            "System",
            "Runtime",
            "A",
            "java.lang.Object is the ultimate root class of the Java class hierarchy.",
            "core-java", "Easy", "TECHNICAL"
        ));

        qList.add(new Question(
            "Which of the following interfaces is used to represent a thread-safe computation that returns a result in Java?",
            "Thread",
            "Runnable",
            "Executor",
            "Callable",
            "D",
            "java.util.concurrent.Callable is a functional interface representing a task that returns a result and can throw an exception, whereas Runnable does not return a result.",
            "core-java", "Easy", "TECHNICAL"
        ));


        // ==================== TECHNICAL: DBMS (7 questions) ====================
        qList.add(new Question(
            "What is the primary difference between standard INNER JOIN and LEFT OUTER JOIN?",
            "INNER JOIN returns only matching rows; LEFT JOIN returns all rows from the left table and matching rows from the right",
            "LEFT JOIN returns only matching rows; INNER JOIN returns all rows",
            "There is no difference",
            "INNER JOIN is faster than LEFT JOIN in all databases",
            "A",
            "INNER JOIN selects rows that have matching values in both tables. LEFT OUTER JOIN returns all records from the left table, and the matched records from the right table. If there is no match, the result is NULL on the right side.",
            "dbms", "Easy", "TECHNICAL"
        ));

        qList.add(new Question(
            "Which normal form deals with removing partial dependencies?",
            "1NF",
            "2NF",
            "3NF",
            "BCNF",
            "B",
            "A table is in 2NF if it is in 1NF and no non-prime attribute is dependent on any proper subset of any candidate key (meaning no partial dependencies).",
            "dbms", "Medium", "TECHNICAL"
        ));

        qList.add(new Question(
            "What does the 'A' in ACID properties stand for?",
            "Availability",
            "Atomicity",
            "Authority",
            "Agreement",
            "B",
            "ACID stands for Atomicity, Consistency, Isolation, and Durability. Atomicity ensures that all operations in a transaction are completed successfully; otherwise, the transaction is completely aborted and rolled back.",
            "dbms", "Easy", "TECHNICAL"
        ));

        qList.add(new Question(
            "Which database index structure is typically used for range queries?",
            "Hash Index",
            "B+ Tree Index",
            "Inverted Index",
            "Bitmap Index",
            "B",
            "B+ Trees keep data sorted, allowing search, sequential access, insertions, and deletions in logarithmic time. This makes B+ Trees extremely efficient for range queries.",
            "dbms", "Hard", "TECHNICAL"
        ));

        qList.add(new Question(
            "What is a phantom read in transaction isolation levels?",
            "A transaction reads a row that has been updated by another transaction",
            "A transaction re-runs a query returning a set of rows that satisfies a search condition and finds that the set of rows has changed due to a recently committed transaction",
            "A transaction reads dirty data",
            "None of the above",
            "B",
            "Phantom read occurs when, in the course of a transaction, two identical queries are executed, and the collection of rows returned by the second query is different from the first due to another transaction inserting/deleting rows.",
            "dbms", "Hard", "TECHNICAL"
        ));

        qList.add(new Question(
            "Which SQL command is used to delete all rows from a table without logging individual row deletions?",
            "DELETE",
            "DROP",
            "TRUNCATE",
            "REMOVE",
            "C",
            "TRUNCATE is a DDL command that removes all rows from a table. It is faster than DELETE because it does not log individual row deletions and deallocates data pages directly.",
            "dbms", "Medium", "TECHNICAL"
        ));

        qList.add(new Question(
            "What is a foreign key?",
            "A key that uniquely identifies a row in a remote table",
            "A field in one table that uniquely identifies a row of another table (points to the primary key)",
            "A primary key of the same table",
            "A composite key",
            "B",
            "A foreign key is a column or group of columns in a relational database table that provides a link between data in two tables. It references the primary key of another table.",
            "dbms", "Easy", "TECHNICAL"
        ));


        // ==================== TECHNICAL: OPERATING-SYSTEMS (7 questions) ====================
        qList.add(new Question(
            "What is thrashing in Operating Systems?",
            "The CPU is idle due to slow I/O devices",
            "A state where the system spends more time page swapping than executing actual processes",
            "The process of deleting temporary files to clear space",
            "High-volume network packet drops",
            "B",
            "Thrashing occurs when a virtual memory system spends more time swapping pages in and out of disk than executing instructions, resulting in very low CPU utilization.",
            "operating-systems", "Medium", "TECHNICAL"
        ));

        qList.add(new Question(
            "Which scheduling algorithm can result in starvation?",
            "Round Robin",
            "Shortest Job First (SJF)",
            "First Come First Served (FCFS)",
            "Completely Fair Scheduler",
            "B",
            "Shortest Job First (SJF) and Priority scheduling can result in starvation. If shorter or higher-priority processes keep arriving, longer or lower-priority processes will wait indefinitely.",
            "operating-systems", "Medium", "TECHNICAL"
        ));

        qList.add(new Question(
            "What are the four necessary conditions for a deadlock to occur?",
            "Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait",
            "Mutual Exclusion, Starvation, Preemption, Circular Wait",
            "Semaphores, Hold & Wait, Mutual Exclusion, Interrupts",
            "None of the above",
            "A",
            "Coffman conditions for deadlock: Mutual Exclusion (non-shareable resources), Hold and Wait (processes holding resources can request more), No Preemption (resources cannot be forcibly taken), and Circular Wait (a circular chain of processes waiting for each other).",
            "operating-systems", "Hard", "TECHNICAL"
        ));

        qList.add(new Question(
            "What is a Translation Lookaside Buffer (TLB)?",
            "A buffer that stores CPU instructions",
            "A memory cache that stores recent translations of virtual memory to physical addresses",
            "A network routing buffer",
            "A disk cache",
            "B",
            "A TLB is a hardware cache used by the memory management unit (MMU) to reduce the time taken to access a user memory location. It stores recent virtual-to-physical address translations.",
            "operating-systems", "Medium", "TECHNICAL"
        ));

        qList.add(new Question(
            "What is the main advantage of virtual memory?",
            "It speeds up execution of programs",
            "It allows execution of processes that may not be completely in memory, enabling larger programs to run",
            "It prevents deadlocks",
            "It eliminates fragmentation completely",
            "B",
            "Virtual memory allows the execution of processes that are not completely in physical memory. It permits users to run programs larger than the physical RAM and increases multitasking capability.",
            "operating-systems", "Easy", "TECHNICAL"
        ));

        qList.add(new Question(
            "In Unix-like systems, what does the fork() system call do?",
            "Terminates the current process",
            "Creates a new child process which is a copy of the calling parent process",
            "Executes a new program file",
            "Splits a file into multiple parts",
            "B",
            "The fork() system call creates a new process (child) by duplicating the calling process (parent). It returns 0 in the child process and the child's PID in the parent process.",
            "operating-systems", "Medium", "TECHNICAL"
        ));

        qList.add(new Question(
            "Which page replacement algorithm suffers from Belady's Anomaly?",
            "LRU (Least Recently Used)",
            "FIFO (First In First Out)",
            "Optimal Page Replacement",
            "LFU (Least Frequently Used)",
            "B",
            "Belady's Anomaly states that for some page-replacement algorithms like FIFO, the page-fault rate may increase as the number of allocated page frames increases.",
            "operating-systems", "Hard", "TECHNICAL"
        ));


        // ==================== TECHNICAL: COMPUTER-NETWORKS (6 questions) ====================
        qList.add(new Question(
            "Which OSI layer is responsible for routing packets across different network domains?",
            "Transport Layer",
            "Data Link Layer",
            "Network Layer",
            "Application Layer",
            "C",
            "The Network Layer (Layer 3) handles routing of data packets from source to destination across multiple networks using IP addressing.",
            "computer-networks", "Easy", "TECHNICAL"
        ));

        qList.add(new Question(
            "What is the primary difference between TCP and UDP?",
            "TCP is connection-oriented and reliable; UDP is connectionless and unreliable",
            "UDP is connection-oriented and reliable; TCP is connectionless",
            "TCP is faster than UDP",
            "TCP is used for streaming while UDP is used for emails",
            "A",
            "Transmission Control Protocol (TCP) is connection-oriented, ensures reliable, ordered delivery of packets, and has flow control. User Datagram Protocol (UDP) is connectionless, lightweight, and suitable for real-time applications where speed is preferred over reliability.",
            "computer-networks", "Easy", "TECHNICAL"
        ));

        qList.add(new Question(
            "Which protocol is used to map an IP address to a physical MAC address?",
            "DHCP",
            "DNS",
            "ARP",
            "ICMP",
            "C",
            "Address Resolution Protocol (ARP) is used to find the hardware (MAC) address corresponding to a known local IP address.",
            "computer-networks", "Medium", "TECHNICAL"
        ));

        qList.add(new Question(
            "What is the size of an IPv6 address?",
            "32 bits",
            "64 bits",
            "128 bits",
            "256 bits",
            "C",
            "IPv6 addresses are 128 bits long (written as eight groups of four hexadecimal digits), compared to IPv4 addresses which are 32 bits long.",
            "computer-networks", "Easy", "TECHNICAL"
        ));

        qList.add(new Question(
            "Which HTTP status code represents 'Internal Server Error'?",
            "400",
            "404",
            "500",
            "503",
            "C",
            "500 is the standard HTTP status code for an unexpected condition encountered by the server, preventing it from fulfilling the request.",
            "computer-networks", "Easy", "TECHNICAL"
        ));

        qList.add(new Question(
            "What is DNS (Domain Name System)?",
            "A system that assigns IP addresses to devices on a network",
            "A decentralized directory that translates human-readable domain names to numerical IP addresses",
            "A security protocol for encrypting internet traffic",
            "A database of email accounts",
            "B",
            "DNS acts as the phonebook of the internet, resolving hostname URLs (like www.google.com) to IP addresses so browsers can load internet resources.",
            "computer-networks", "Easy", "TECHNICAL"
        ));


        // ==================== TECHNICAL: DATA-STRUCTURES (7 questions) ====================
        qList.add(new Question(
            "What is the worst-case time complexity of searching in a Balanced Binary Search Tree (like AVL tree)?",
            "O(1)",
            "O(log n)",
            "O(n)",
            "O(n log n)",
            "B",
            "A balanced binary search tree maintains a height of O(log n), so search, insertion, and deletion operations take O(log n) time in both average and worst cases.",
            "data-structures", "Medium", "TECHNICAL"
        ));

        qList.add(new Question(
            "Which data structure is typically used to implement Breadth-First Search (BFS) on a graph?",
            "Stack",
            "Queue",
            "Priority Queue",
            "Heap",
            "B",
            "BFS visits vertices level-by-level, which follows a First-In-First-Out behavior. Therefore, a Queue is the standard data structure used for BFS. (DFS uses a Stack).",
            "data-structures", "Easy", "TECHNICAL"
        ));

        qList.add(new Question(
            "What is the best-case time complexity of the Quick Sort algorithm?",
            "O(n)",
            "O(n log n)",
            "O(n^2)",
            "O(log n)",
            "B",
            "Quick Sort's best-case and average-case time complexity is O(n log n) when the pivot divides the array into roughly equal halves. The worst-case is O(n^2) when the array is already sorted and a poor pivot selection is made.",
            "data-structures", "Medium", "TECHNICAL"
        ));

        qList.add(new Question(
            "Which of the following is a non-linear data structure?",
            "Array",
            "Stack",
            "Queue",
            "Graph",
            "D",
            "Arrays, stacks, and queues are linear data structures where elements are arranged sequentially. Graphs and trees are non-linear data structures representing hierarchical or network relationships.",
            "data-structures", "Easy", "TECHNICAL"
        ));

        qList.add(new Question(
            "What is the main drawback of using a singly linked list compared to a dynamic array?",
            "Singly linked lists have O(n) access time for arbitrary elements",
            "Singly linked lists cannot grow in size dynamically",
            "Inserting at the beginning of a singly linked list is O(n)",
            "Singly linked lists use less memory than arrays",
            "A",
            "Arrays support O(1) random access (by index) because elements are stored contiguously in memory. Linked lists must be traversed sequentially from the head, resulting in O(n) lookup time for arbitrary positions.",
            "data-structures", "Medium", "TECHNICAL"
        ));

        qList.add(new Question(
            "Which stack operation is used to retrieve the top element without removing it?",
            "push()",
            "pop()",
            "peek()",
            "enqueue()",
            "C",
            "The peek() or top() operation returns the value of the top element of the stack without modifying the stack contents. pop() removes and returns it.",
            "data-structures", "Easy", "TECHNICAL"
        ));

        qList.add(new Question(
            "Which sorting algorithm is stable and has a guaranteed worst-case time complexity of O(n log n)?",
            "Quick Sort",
            "Merge Sort",
            "Selection Sort",
            "Bubble Sort",
            "B",
            "Merge Sort uses a divide-and-conquer strategy, ensuring O(n log n) comparisons in best, worst, and average cases. It is also stable (preserves relative order of equal elements), unlike Quick Sort.",
            "data-structures", "Medium", "TECHNICAL"
        ));


        // ==================== APTITUDE: QUANTITATIVE (7 questions) ====================
        qList.add(new Question(
            "A sum of money doubles itself in 10 years at simple interest. What is the rate of interest per annum?",
            "5%",
            "8%",
            "10%",
            "12%",
            "C",
            "Let Principal = P. Amount = 2P. Interest (I) = P. Formula: I = (P * R * T) / 100. P = (P * R * 10) / 100 => R = 100 / 10 = 10%.",
            "quantitative", "Easy", "APTITUDE"
        ));

        qList.add(new Question(
            "A and B can complete a work in 12 days, B and C in 15 days, and C and A in 20 days. If A, B, and C work together, in how many days will they complete the work?",
            "5 days",
            "8 days",
            "10 days",
            "12 days",
            "C",
            "1 day work: (A+B) = 1/12, (B+C) = 1/15, (C+A) = 1/20. Adding these: 2(A+B+C) = 1/12 + 1/15 + 1/20 = (5 + 4 + 3)/60 = 12/60 = 1/5. Hence, (A+B+C) 1 day work = 1/10. Together they will finish in 10 days.",
            "quantitative", "Medium", "APTITUDE"
        ));

        qList.add(new Question(
            "A train 150 meters long is running at a speed of 54 km/h. How much time will it take to pass a pole?",
            "8 seconds",
            "10 seconds",
            "12 seconds",
            "15 seconds",
            "B",
            "Speed = 54 km/h = 54 * (5/18) = 15 m/s. Time to pass a pole = Length of train / Speed = 150 / 15 = 10 seconds.",
            "quantitative", "Easy", "APTITUDE"
        ));

        qList.add(new Question(
            "The price of petrol increased by 25%. By what percentage should a driver reduce consumption so that their expenditure remains unchanged?",
            "20%",
            "25%",
            "15%",
            "33.3%",
            "A",
            "Formula for percentage reduction = [R / (100 + R)] * 100 = [25 / 125] * 100 = 20%.",
            "quantitative", "Medium", "APTITUDE"
        ));

        qList.add(new Question(
            "A bag contains 5 red, 8 green, and 7 blue balls. A ball is drawn at random. What is the probability that it is green or red?",
            "13/20",
            "3/5",
            "3/4",
            "1/2",
            "A",
            "Total balls = 5 + 8 + 7 = 20. Favorable balls (red or green) = 5 + 8 = 13. Probability = 13/20.",
            "quantitative", "Easy", "APTITUDE"
        ));

        qList.add(new Question(
            "If the ratio of the areas of two squares is 9:16, what is the ratio of their perimeters?",
            "3:4",
            "9:16",
            "27:64",
            "81:256",
            "A",
            "Area ratio = a1^2 / a2^2 = 9/16 => Side ratio a1/a2 = 3/4. Perimeter ratio = 4*a1 / 4*a2 = a1/a2 = 3:4.",
            "quantitative", "Easy", "APTITUDE"
        ));

        qList.add(new Question(
            "Find the average of all prime numbers between 30 and 50.",
            "39.8",
            "41.2",
            "38.5",
            "40.0",
            "A",
            "Prime numbers between 30 and 50 are: 31, 37, 41, 43, 47. Sum = 31+37+41+43+47 = 199. Average = 199 / 5 = 39.8.",
            "quantitative", "Medium", "APTITUDE"
        ));


        // ==================== APTITUDE: LOGICAL-REASONING (7 questions) ====================
        qList.add(new Question(
            "In a certain code, 'TEMPLE' is written as 'VHOPNZ'. How is 'CHURCH' written in that code if the rule is a constant +2 alphabetical shift?",
            "EJWTEJ",
            "EJWTEK",
            "EKWTFJ",
            "EJVSDI",
            "A",
            "Each letter is shifted 2 positions forward in the alphabetical sequence: C+2=E, H+2=J, U+2=W, R+2=T, C+2=E, H+2=J.",
            "logical-reasoning", "Easy", "APTITUDE"
        ));

        qList.add(new Question(
            "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?",
            "Sister",
            "Grandmother",
            "Mother",
            "Daughter",
            "C",
            "The only daughter of my mother is Me (the woman herself). So, 'His mother is Me'. Therefore, the woman is the mother of the man.",
            "logical-reasoning", "Medium", "APTITUDE"
        ));

        qList.add(new Question(
            "Find the missing term in the series: 3, 7, 15, 31, 63, ?",
            "95",
            "111",
            "127",
            "128",
            "C",
            "The pattern is: (Previous Number * 2) + 1. 63 * 2 + 1 = 127.",
            "logical-reasoning", "Easy", "APTITUDE"
        ));

        qList.add(new Question(
            "If A + B means A is the brother of B; A - B means A is the sister of B; A * B means A is the father of B. Which of the following means C is the son of D?",
            "D * C - B",
            "D * C + B",
            "C * D - B",
            "D + C * B",
            "B",
            "D * C + B means D is the father of C, and C is the brother of B. Since C is a brother, C is male, and since D is C's father, C is the son of D.",
            "logical-reasoning", "Medium", "APTITUDE"
        ));

        qList.add(new Question(
            "A person walks 10 km towards North. From there he walks 6 km towards South. Then, he walks 3 km towards East. How far and in which direction is he with reference to his starting point?",
            "5 km North-East",
            "5 km South-East",
            "7 km North-East",
            "7 km West",
            "A",
            "Starting from (0,0): Walks 10 km North to (0,10). Walks 6 km South to (0,4). Walks 3 km East to (3,4). Distance from (0,0) is sqrt(3^2 + 4^2) = 5 km. Direction is North-East.",
            "logical-reasoning", "Medium", "APTITUDE"
        ));

        qList.add(new Question(
            "All write-ups are books. All books are novels. Which of the following conclusions logically follows?",
            "All novels are write-ups",
            "All write-ups are novels",
            "Some novels are not write-ups",
            "None of the conclusions follow",
            "B",
            "Since all write-ups are books and all books are novels, the write-ups set is a subset of books, which is a subset of novels. Therefore, all write-ups are novels.",
            "logical-reasoning", "Easy", "APTITUDE"
        ));

        qList.add(new Question(
            "Arrange the words in a meaningful logical sequence: 1. Key, 2. Door, 3. Lock, 4. Room, 5. Switch on.",
            "5, 1, 2, 4, 3",
            "4, 2, 1, 5, 3",
            "1, 3, 2, 4, 5",
            "1, 2, 3, 5, 4",
            "C",
            "The logical sequence of events is: key (1) is used in the lock (3) to open the door (2) to enter the room (4) and then switch on the light (5).",
            "logical-reasoning", "Easy", "APTITUDE"
        ));


        // ==================== APTITUDE: VERBAL-ABILITY (6 questions) ====================
        qList.add(new Question(
            "Choose the word which is most similar in meaning to 'ABANDON'?",
            "Retain",
            "Forsake",
            "Adopt",
            "Keep",
            "B",
            "To abandon means to desert, leave behind, or give up. Forsake is a synonym meaning to renounce or leave.",
            "verbal-ability", "Easy", "APTITUDE"
        ));

        qList.add(new Question(
            "Identify the part of the sentence which contains a grammatical error: 'He has been working on this project since three hours.'",
            "He has been",
            "working on",
            "this project",
            "since three hours",
            "D",
            "For a duration of time (three hours), 'for' should be used instead of 'since'. 'Since' is used for a specific point in time (e.g., since 9 AM).",
            "verbal-ability", "Medium", "APTITUDE"
        ));

        qList.add(new Question(
            "Fill in the blank: The manager was ______ angry with the employee's performance.",
            "extreme",
            "extremely",
            "extremity",
            "extremeness",
            "B",
            "An adverb is required to modify the adjective 'angry'. 'Extremely' is the adverb form.",
            "verbal-ability", "Easy", "APTITUDE"
        ));

        qList.add(new Question(
            "Select the sentence with correct subject-verb agreement.",
            "Neither the teacher nor the students was present.",
            "Neither the teacher nor the students were present.",
            "Neither the teacher or the students was present.",
            "Neither the teacher nor the students is present.",
            "B",
            "When a compound subject contains both a singular and a plural noun joined by 'nor', the verb should agree with the part of the subject closest to it. 'Students' is plural, so 'were' is correct.",
            "verbal-ability", "Medium", "APTITUDE"
        ));

        qList.add(new Question(
            "What is the meaning of the idiom 'To burn the midnight oil'?",
            "To work late into the night",
            "To waste resources",
            "To create a disturbance",
            "To search for something in the dark",
            "A",
            "Burning the midnight oil refers to working or studying late into the night.",
            "verbal-ability", "Easy", "APTITUDE"
        ));

        qList.add(new Question(
            "Choose the word most opposite in meaning to 'MITIGATE'?",
            "Alleviate",
            "Aggravate",
            "Relieve",
            "Diminish",
            "B",
            "Mitigate means to make less severe or serious. Aggravate is the opposite, meaning to make worse or more severe.",
            "verbal-ability", "Medium", "APTITUDE"
        ));


        // ==================== APTITUDE: DATA-INTERPRETATION (6 questions) ====================
        qList.add(new Question(
            "In a company of 500 employees, 60% are engineers. Of the engineers, 40% are software developers. How many software developers are in the company?",
            "120",
            "200",
            "150",
            "300",
            "A",
            "Total engineers = 60% of 500 = 300. Software developers = 40% of 300 = 120.",
            "data-interpretation", "Easy", "APTITUDE"
        ));

        qList.add(new Question(
            "A pie chart representing expenses shows Rent as 90 degrees. What percentage of total expenses is spent on Rent?",
            "25%",
            "30%",
            "20%",
            "15%",
            "A",
            "A full circle is 360 degrees. Rent percentage = (90 / 360) * 100 = 25%.",
            "data-interpretation", "Easy", "APTITUDE"
        ));

        qList.add(new Question(
            "In a bar chart showing sales, Year 1 sales = $40k, Year 2 sales = $50k. What is the percentage increase in sales from Year 1 to Year 2?",
            "20%",
            "25%",
            "10%",
            "15%",
            "B",
            "Increase = $50k - $40k = $10k. Percentage Increase = (10 / 40) * 100 = 25%.",
            "data-interpretation", "Medium", "APTITUDE"
        ));

        qList.add(new Question(
            "If the ratio of expenditures on food, education, and saving is 5:3:2, and total monthly income is $2000 (all spent/saved in this ratio), what is the amount spent on education?",
            "$600",
            "$1000",
            "$400",
            "$500",
            "A",
            "Total ratio parts = 5 + 3 + 2 = 10. Education share = (3/10) * $2000 = $600.",
            "data-interpretation", "Easy", "APTITUDE"
        ));

        qList.add(new Question(
            "In a line graph, a company's profit increases by 10% in month 1 and decreases by 10% in month 2. What is the net percentage change in profit over the two months?",
            "0% change",
            "1% decrease",
            "1% increase",
            "2% decrease",
            "B",
            "Net change = 10 - 10 - (10 * 10)/100 = 0 - 1 = -1% (1% decrease).",
            "data-interpretation", "Medium", "APTITUDE"
        ));

        qList.add(new Question(
            "Three classes A, B, and C have 20, 30, and 50 students respectively. The pass percentages are 80%, 60%, and 50%. What is the overall pass percentage of the school?",
            "59%",
            "63%",
            "55%",
            "60%",
            "A",
            "Passed students: Class A = 20 * 0.8 = 16; Class B = 30 * 0.6 = 18; Class C = 50 * 0.5 = 25. Total passed = 16 + 18 + 25 = 59. Total students = 20 + 30 + 50 = 100. Overall pass percentage = (59 / 100) * 100 = 59%.",
            "data-interpretation", "Medium", "APTITUDE"
        ));

        questionRepository.saveAll(qList);
    }

    private void seedStudyMaterials() {
        List<StudyMaterial> materials = List.of(
            new StudyMaterial(
                "Quantitative Aptitude Reference Handbook",
                "PDF",
                "https://www.placeprep.org/materials/quant_formulas.pdf",
                "Formulas and quick tricks for Percentage, Ratio, Average, and Time & Work.",
                "quantitative"
            ),
            new StudyMaterial(
                "Operating Systems Concept Notes",
                "PDF",
                "https://www.placeprep.org/materials/os_notes.pdf",
                "Comprehensive notes on Process management, Scheduling algorithms, Deadlocks, and TLB.",
                "operating-systems"
            ),
            new StudyMaterial(
                "DBMS Joins & Normalization Guide",
                "PDF",
                "https://www.placeprep.org/materials/dbms_normalization.pdf",
                "A cheat sheet for database design normal forms (1NF, 2NF, 3NF, BCNF) and SQL joins.",
                "dbms"
            ),
            new StudyMaterial(
                "Java OOPs Crash Course",
                "VIDEO",
                "https://www.youtube.com/embed/tVzUXW6s9jI",
                "Object Oriented Programming concepts explained visually for Java placements.",
                "core-java"
            ),
            new StudyMaterial(
                "SQL Query Practice Class",
                "VIDEO",
                "https://www.youtube.com/embed/5WZ5X2kE_4U",
                "Master complex SQL queries, nested subqueries, and group-by questions.",
                "dbms"
            ),
            new StudyMaterial(
                "Dynamic Programming Masterclass",
                "VIDEO",
                "https://www.youtube.com/embed/oBt53YbR9K4",
                "Introduction to recursion, memoization, and tabulation with core DP problems.",
                "data-structures"
            )
        );
        studyMaterialRepository.saveAll(materials);
    }

    private void seedMockTests() {
        List<Question> allQuestions = questionRepository.findAll();
        if (allQuestions.size() < 10) return;

        // Associate first 10 questions to TCS NQT Mock Test
        List<Question> test1Qs = new ArrayList<>(allQuestions.subList(0, Math.min(10, allQuestions.size())));
        MockTest test1 = new MockTest(
            "TCS NQT Mock Assessment 1",
            "A standard evaluation for TCS recruitment including Quantitative Aptitude, Logical Reasoning, and Java concepts.",
            20,
            "Medium",
            test1Qs
        );

        // Associate next 10 questions to Google Technical Mock Test
        List<Question> test2Qs = new ArrayList<>(allQuestions.subList(Math.min(10, allQuestions.size()), Math.min(20, allQuestions.size())));
        MockTest test2 = new MockTest(
            "Google Prep mock Test (Hard)",
            "Contains challenging questions in Operating Systems, Networks, and Data Structures designed for premium tech companies.",
            30,
            "Hard",
            test2Qs
        );

        mockTestRepository.save(test1);
        mockTestRepository.save(test2);
    }

    private void seedCodingProblems() {
        List<CodingProblem> problems = List.of(
            new CodingProblem(
                "Two Sum",
                "Easy",
                "Arrays",
                "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
                "public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (map.containsKey(complement)) {\n            return new int[] { map.get(complement), i };\n        }\n        map.put(nums[i], i);\n    }\n    return new int[] {};\n}",
                "Use a Hash Map to look up the complement in O(1) time. Iterate through the array once. For each element, check if the complement (target - num) is in the map. If yes, return indices. Otherwise, store the number and index."
            ),
            new CodingProblem(
                "Reverse Linked List",
                "Easy",
                "Linked Lists",
                "Given the head of a singly linked list, reverse the list, and return its reversed list.\n\nExample 1:\nInput: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]",
                "public ListNode reverseList(ListNode head) {\n    ListNode prev = null;\n    ListNode curr = head;\n    while (curr != null) {\n        ListNode nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}",
                "Use an iterative approach. Maintain three pointers: prev (initially null), curr (initially head), and nextTemp. Traverse the list, re-linking curr.next to prev, then moving prev and curr forward."
            ),
            new CodingProblem(
                "Longest Common Subsequence",
                "Medium",
                "Dynamic Programming",
                "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.",
                "public int longestCommonSubsequence(String text1, String text2) {\n    int m = text1.length(), n = text2.length();\n    int[][] dp = new int[m + 1][n + 1];\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {\n                dp[i][j] = dp[i - 1][j - 1] + 1;\n            } else {\n                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n            }\n        }\n    }\n    return dp[m][n];\n}",
                "Construct a 2D grid of size (m+1) x (n+1). If text1[i-1] equals text2[j-1], then dp[i][j] = dp[i-1][j-1] + 1. Otherwise, take the maximum of moving either pointer: Math.max(dp[i-1][j], dp[i][j-1])."
            )
        );
        codingProblemRepository.saveAll(problems);
    }

    private void seedInterviewResources() {
        List<InterviewResource> resources = List.of(
            new InterviewResource(
                "HR",
                "Mastering 'Tell me about yourself'",
                "The classic opener. Focus on a 3-step formula:\n1. Present: State your current education or job, along with recent highlights.\n2. Past: Briefly mention a project or internship that aligns with the job profile.\n3. Future: Explain why you are excited about this role and this company.",
                "General",
                "PlacePrep Mentors"
            ),
            new InterviewResource(
                "TECHNICAL",
                "Top SQL Joins & Aggregate Queries",
                "Be prepared to write SQL Joins on the fly. Remember:\n- INNER JOIN: only matching rows.\n- LEFT JOIN: all from left + matches from right.\n- RIGHT JOIN: all from right + matches from left.\n- GROUP BY: always use with aggregate functions (COUNT, SUM, AVG) to group rows by values.",
                "DBMS",
                "Database Experts"
            ),
            new InterviewResource(
                "RESUME",
                "ATS Resume Formatting Secrets",
                "Many companies use Applicant Tracking Systems (ATS) to filter resumes. To rank high:\n1. Use standard headings (Education, Experience, Projects).\n2. Format with clean standard fonts (Calibri, Arial, Times New Roman).\n3. Use action verbs (Designed, Optimized, Developed) and quantify achievements (e.g. 'Improved efficiency by 25%').",
                "General",
                "Career Coaches"
            ),
            new InterviewResource(
                "EXPERIENCE",
                "TCS Digital Interview Experience",
                "First round was on TCS iON platform (MCQ and 2 coding tasks). Technical round covered standard OOPS, differences between Java and C++, DBMS joins, and a puzzle. HR round was friendly, asking about location preference and shift flexibility.",
                "TCS",
                "Ankit Sharma (Class of 2025)"
            ),
            new InterviewResource(
                "EXPERIENCE",
                "Amazon SDE-1 Interview Guide",
                "The process consisted of Online Assessment (OA) with 2 coding tasks. Next were 3 virtual rounds: 2 Technical and 1 Managerial (Bar Raiser). Focus heavily on LeetCode Medium/Hard DFS, BFS, and Amazon's Leadership Principles.",
                "Amazon",
                "Neha Sen (Alumni)"
            )
        );
        interviewResourceRepository.saveAll(resources);
    }
}
