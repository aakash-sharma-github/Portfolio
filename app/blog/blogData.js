// Sample blog data (in a real app, this would come from an API or CMS)
export const blogPosts = [
  {
    id: 1,
    title: 'Building Modern Web Applications with Next.js',
    excerpt: 'Explore the power of Next.js for creating fast, SEO-friendly React applications with server-side rendering capabilities.',
    coverImage: '/assets/blog/nextjs-cover.jpg',
    date: 'June 15, 2023',
    readTime: '5 min read',
    category: 'Web Development',
    slug: 'building-modern-web-applications-with-nextjs',
    author: {
      name: 'Aakash Sharma',
      avatar: '/assets/avatar.jpg',
      bio: 'Full-stack developer with a passion for modern web technologies'
    },
    content: `
      <p>Next.js has revolutionized the way developers build React applications by providing a powerful framework that combines the best of server-side rendering and static site generation.</p>
      
      <h2>Why Next.js?</h2>
      <p>Next.js solves many common challenges in React development:</p>
      <ul>
        <li>Server-side rendering for improved SEO and performance</li>
        <li>Automatic code splitting for faster page loads</li>
        <li>Simple client-side routing with built-in Link component</li>
        <li>API routes for backend functionality</li>
        <li>Built-in CSS and Sass support</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>Creating a new Next.js project is straightforward:</p>
      <pre><code>npx create-next-app my-next-app</code></pre>
      
      <p>This command sets up a new Next.js project with all the necessary configurations. Once installed, you can start the development server:</p>
      <pre><code>cd my-next-app
npm run dev</code></pre>
      
      <h2>Pages and Routing</h2>
      <p>Next.js uses a file-system based router. Files in the pages directory automatically become routes. For example:</p>
      <ul>
        <li><code>pages/index.js</code> → <code>/</code></li>
        <li><code>pages/about.js</code> → <code>/about</code></li>
        <li><code>pages/blog/[slug].js</code> → <code>/blog/:slug</code></li>
      </ul>
      
      <h2>Data Fetching</h2>
      <p>Next.js provides several methods for data fetching:</p>
      <ul>
        <li><strong>getStaticProps</strong>: Fetch data at build time</li>
        <li><strong>getStaticPaths</strong>: Specify dynamic routes to pre-render</li>
        <li><strong>getServerSideProps</strong>: Fetch data on each request</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Next.js continues to evolve with each release, adding new features and improvements. It's an excellent choice for building modern web applications that require both performance and SEO benefits.</p>
      
      <p>Whether you're building a personal blog, e-commerce site, or complex web application, Next.js provides the tools and flexibility to create exceptional user experiences.</p>
    `
  },
  {
    id: 2,
    title: 'The Future of Frontend Development',
    excerpt: 'Discover emerging trends and technologies that are shaping the future of frontend development in 2023 and beyond.',
    coverImage: '/assets/blog/frontend-future.jpg',
    date: 'July 22, 2023',
    readTime: '7 min read',
    category: 'Frontend',
    slug: 'the-future-of-frontend-development',
    author: {
      name: 'Aakash Sharma',
      avatar: '/assets/avatar.jpg',
      bio: 'Full-stack developer with a passion for modern web technologies'
    },
    content: `
      <p>Frontend development is evolving at a rapid pace, with new tools, frameworks, and methodologies emerging constantly. Let's explore some of the most significant trends shaping the future of frontend development.</p>
      
      <h2>WebAssembly (Wasm)</h2>
      <p>WebAssembly is enabling high-performance applications in the browser by allowing code written in languages like C, C++, and Rust to run at near-native speed. This opens up possibilities for complex applications like video editing, 3D rendering, and games to run directly in the browser.</p>
      
      <h2>Micro-Frontends</h2>
      <p>Micro-frontends extend the concept of microservices to frontend development, allowing teams to build and deploy parts of a frontend independently. This architecture enables larger organizations to scale their development process more effectively.</p>
      
      <h2>AI-Assisted Development</h2>
      <p>Tools like GitHub Copilot are just the beginning of AI's impact on frontend development. We can expect more sophisticated AI assistants that help with code generation, debugging, and optimization.</p>
      
      <h2>Web Components</h2>
      <p>Web Components provide a standard way to create reusable custom elements with encapsulated functionality. As browser support improves, we'll likely see more adoption of this technology for creating truly portable components.</p>
      
      <h2>Serverless and Edge Computing</h2>
      <p>The line between frontend and backend continues to blur with serverless functions and edge computing. Frameworks like Next.js and Remix are pushing more logic to the edge, resulting in faster, more resilient applications.</p>
      
      <h2>Conclusion</h2>
      <p>The future of frontend development is exciting and full of possibilities. By staying informed about these trends and continuously learning, developers can position themselves at the forefront of this evolving landscape.</p>
    `
  },
  {
    id: 3,
    title: 'Mastering CSS Grid Layout',
    excerpt: 'Learn how to create complex, responsive layouts with CSS Grid that work across all modern browsers.',
    coverImage: '/assets/blog/css-grid.jpg',
    date: 'August 10, 2023',
    readTime: '6 min read',
    category: 'CSS',
    slug: 'mastering-css-grid-layout',
    author: {
      name: 'Aakash Sharma',
      avatar: '/assets/avatar.jpg',
      bio: 'Full-stack developer with a passion for modern web technologies'
    },
    content: `
      <p>CSS Grid Layout has revolutionized how we build web layouts, providing a powerful two-dimensional system that makes complex designs more accessible than ever before.</p>
      
      <h2>Why CSS Grid?</h2>
      <p>CSS Grid offers several advantages over previous layout methods:</p>
      <ul>
        <li>True two-dimensional control over both rows and columns</li>
        <li>The ability to name grid areas for intuitive placement</li>
        <li>Powerful alignment capabilities</li>
        <li>Responsive design without media queries (using auto-fill/auto-fit)</li>
        <li>Simplified markup without nested containers</li>
      </ul>
      
      <h2>Basic Grid Concepts</h2>
      <p>To create a grid container, you simply need to set <code>display: grid</code> on an element. From there, you can define your columns and rows:</p>
      
      <pre><code>.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}</code></pre>
      
      <p>This creates a three-column grid with equal-width columns and a 20px gap between grid items.</p>
      
      <h2>Placing Items</h2>
      <p>Grid items can be placed precisely using grid lines or named areas:</p>
      
      <pre><code>.item {
  grid-column: 1 / 3; /* Start at line 1, end at line 3 */
  grid-row: 2 / 4;    /* Start at line 2, end at line 4 */
}</code></pre>
      
      <h2>Responsive Grids</h2>
      <p>One of the most powerful features of CSS Grid is the ability to create responsive layouts without media queries using <code>minmax()</code>, <code>auto-fill</code>, and <code>auto-fit</code>:</p>
      
      <pre><code>.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}</code></pre>
      
      <p>This creates a responsive grid where columns are at least 250px wide and fill the available space.</p>
      
      <h2>Conclusion</h2>
      <p>CSS Grid has transformed how we approach web layouts, making previously complex designs straightforward to implement. With excellent browser support, there's no reason not to start using Grid in your projects today.</p>
    `
  },
  {
    id: 4,
    title: 'Introduction to TypeScript for JavaScript Developers',
    excerpt: 'A beginner-friendly guide to TypeScript and how it can improve your JavaScript development workflow.',
    coverImage: '/assets/blog/typescript-intro.jpg',
    date: 'September 5, 2023',
    readTime: '8 min read',
    category: 'TypeScript',
    slug: 'introduction-to-typescript-for-javascript-developers',
    author: {
      name: 'Aakash Sharma',
      avatar: '/assets/avatar.jpg',
      bio: 'Full-stack developer with a passion for modern web technologies'
    },
    content: `
      <p>TypeScript has gained tremendous popularity in recent years, and for good reason. It adds static typing to JavaScript, providing developers with tools to write more robust, maintainable code.</p>
      
      <h2>What is TypeScript?</h2>
      <p>TypeScript is a superset of JavaScript developed by Microsoft that adds static type definitions. TypeScript code is transpiled to JavaScript, which means it can run anywhere JavaScript runs.</p>
      
      <h2>Why Use TypeScript?</h2>
      <p>There are several compelling reasons to adopt TypeScript:</p>
      <ul>
        <li>Catch errors during development rather than at runtime</li>
        <li>Better IDE support with intelligent code completion</li>
        <li>Easier refactoring</li>
        <li>Self-documenting code</li>
        <li>Enhanced team collaboration</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>To start using TypeScript, you'll need to install it:</p>
      <pre><code>npm install -g typescript</code></pre>
      
      <p>Create a simple TypeScript file (e.g., <code>hello.ts</code>):</p>
      <pre><code>function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("TypeScript"));</code></pre>
      
      <p>Compile it to JavaScript:</p>
      <pre><code>tsc hello.ts</code></pre>
      
      <h2>Basic Types</h2>
      <p>TypeScript provides several basic types:</p>
      <pre><code>// Basic types
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];

// Object type
interface Person {
  firstName: string;
  lastName: string;
  age?: number; // Optional property
}

// Function type
function add(a: number, b: number): number {
  return a + b;
}</code></pre>
      
      <h2>Conclusion</h2>
      <p>TypeScript offers significant advantages for JavaScript developers, especially for larger projects or teams. While there is a learning curve, the benefits in terms of code quality and developer experience make it well worth the investment.</p>
    `
  },
  {
    id: 5,
    title: 'Optimizing React Performance',
    excerpt: 'Practical techniques to improve the performance of your React applications and provide a better user experience.',
    coverImage: '/assets/blog/react-performance.jpg',
    date: 'October 18, 2023',
    readTime: '10 min read',
    category: 'React',
    slug: 'optimizing-react-performance',
    author: {
      name: 'Aakash Sharma',
      avatar: '/assets/avatar.jpg',
      bio: 'Full-stack developer with a passion for modern web technologies'
    },
    content: `
      <p>As React applications grow in complexity, performance optimization becomes increasingly important. In this article, we'll explore practical techniques to improve the performance of your React applications.</p>
      
      <h2>Identifying Performance Issues</h2>
      <p>Before optimizing, it's important to identify where performance issues exist. React DevTools Profiler is an invaluable tool for this purpose, allowing you to record and analyze component renders.</p>
      
      <h2>Memoization Techniques</h2>
      <p>React provides several APIs for memoization:</p>
      
      <h3>React.memo</h3>
      <p>Use <code>React.memo</code> to prevent unnecessary re-renders of functional components:</p>
      <pre><code>const MyComponent = React.memo(function MyComponent(props) {
  // Your component logic
});</code></pre>
      
      <h3>useMemo and useCallback</h3>
      <p>These hooks help memoize values and functions:</p>
      <pre><code>// Memoize a computed value
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// Memoize a callback function
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);</code></pre>
      
      <h2>Code Splitting</h2>
      <p>Reduce your initial bundle size with code splitting using dynamic imports:</p>
      <pre><code>import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}</code></pre>
      
      <h2>Virtualization for Long Lists</h2>
      <p>When rendering long lists, use virtualization libraries like <code>react-window</code> or <code>react-virtualized</code> to only render items that are visible in the viewport:</p>
      <pre><code>import { FixedSizeList } from 'react-window';

function MyList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index]}
    </div>
  );

  return (
    <FixedSizeList
      height={500}
      width={300}
      itemCount={items.length}
      itemSize={35}
    >
      {Row}
    </FixedSizeList>
  );
}</code></pre>
      
      <h2>Conclusion</h2>
      <p>Performance optimization in React is an ongoing process. By implementing these techniques and regularly profiling your application, you can provide a smoother, more responsive experience for your users.</p>
    `
  },
  {
    id: 6,
    title: 'Building a Portfolio That Stands Out',
    excerpt: 'Tips and strategies for creating a developer portfolio that captures attention and showcases your skills effectively.',
    coverImage: '/assets/blog/portfolio-tips.jpg',
    date: 'November 30, 2023',
    readTime: '6 min read',
    category: 'Career',
    slug: 'building-a-portfolio-that-stands-out',
    author: {
      name: 'Aakash Sharma',
      avatar: '/assets/avatar.jpg',
      bio: 'Full-stack developer with a passion for modern web technologies'
    },
    content: `
      <p>A well-crafted portfolio is essential for developers looking to showcase their skills and attract potential employers or clients. In this article, we'll explore strategies for creating a portfolio that stands out from the crowd.</p>
      
      <h2>Focus on Quality, Not Quantity</h2>
      <p>It's better to showcase a few high-quality projects than many mediocre ones. Choose projects that:</p>
      <ul>
        <li>Demonstrate a range of skills</li>
        <li>Solve real problems</li>
        <li>Show your ability to write clean, maintainable code</li>
        <li>Highlight your unique strengths</li>
      </ul>
      
      <h2>Tell a Story</h2>
      <p>For each project, don't just list technologies used. Tell a compelling story that includes:</p>
      <ul>
        <li>The problem you were solving</li>
        <li>Your approach and thought process</li>
        <li>Challenges you encountered and how you overcame them</li>
        <li>The impact or results of your solution</li>
      </ul>
      
      <h2>Design Matters</h2>
      <p>Even if you're not a designer, your portfolio should be visually appealing and user-friendly:</p>
      <ul>
        <li>Use a clean, modern design</li>
        <li>Ensure responsive layout for all devices</li>
        <li>Optimize loading speed</li>
        <li>Make navigation intuitive</li>
        <li>Include visual elements like screenshots, GIFs, or videos</li>
      </ul>
      
      <h2>Showcase Your Process</h2>
      <p>Employers are often as interested in how you work as they are in the final product:</p>
      <ul>
        <li>Include snippets of particularly elegant or clever code</li>
        <li>Show wireframes or prototypes</li>
        <li>Discuss architecture decisions</li>
        <li>Link to GitHub repositories with well-documented code</li>
      </ul>
      
      <h2>Keep It Updated</h2>
      <p>A portfolio is a living document that should evolve as you grow as a developer:</p>
      <ul>
        <li>Regularly add new projects</li>
        <li>Update older projects with new skills learned</li>
        <li>Remove outdated work that no longer represents your abilities</li>
        <li>Include a blog or case studies to demonstrate your knowledge</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>A standout portfolio is more than just a collection of projects—it's a carefully curated presentation of your skills, thought process, and professional identity. By focusing on quality, storytelling, design, and process, you can create a portfolio that effectively communicates your value to potential employers or clients.</p>
    `
  }
];

// Categories for filtering
export const categories = ['All', 'Web Development', 'Frontend', 'CSS', 'TypeScript', 'React', 'Career']; 