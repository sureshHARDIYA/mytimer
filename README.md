# MyTimer - Time Tracking Application

## About

MyTimer is a web-based time tracking application designed for freelancers and professionals to monitor time spent on projects. The application provides comprehensive tracking features, project management capabilities, and detailed analytics to help users understand their time allocation and productivity patterns.

## Key Features

- User authentication and secure session management
- Real-time timer for active time tracking
- Manual time entry for historical records
- Project-based time organization
- Custom tagging system for categorization
- Interactive calendar view with time visualization
- Advanced filtering and search across time entries
- Weekly and project-specific reports with charts
- Automated weekly email summaries
- Tag-based analytics with pie charts

## Technologies

This application is built with modern web technologies:

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [NextAuth.js](https://next-auth.js.org/) - Authentication solution
- [SCSS](https://sass-lang.com/) - CSS preprocessor
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [SWR](https://swr.vercel.app/) - Data fetching and caching
- [Zod](https://zod.dev/) - Schema validation
- [Recharts](https://recharts.org/) - Charting library
- [React Hook Form](https://react-hook-form.com/) - Form management
- [FullCalendar](https://fullcalendar.io/) - Calendar integration
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## Getting Started for Developers

### Prerequisites

- Node.js 16.x or higher
- MongoDB instance (local or cloud)
- npm or yarn package manager

### Installation

1. Clone the repository:

```sh
git clone https://github.com/sureshHARDIYA/mytimer.git
cd mytimer
```

2. Install dependencies:

```sh
npm install
```

3. Configure environment variables:

Copy the `.env.example` file to `.env` and update with your configuration:

```sh
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI` - Your MongoDB connection string
- `NEXTAUTH_SECRET` - Secret key for NextAuth.js
- `NEXTAUTH_URL` - Your application URL
- Email configuration for weekly reports (if using email features)

4. Start the development server:

```sh
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

- `/components` - Reusable React components
- `/pages` - Next.js pages and API routes
- `/models` - Mongoose database models
- `/lib` - Utility functions and helpers
- `/styles` - Global styles and SCSS modules
- `/hooks` - Custom React hooks
- `/types` - TypeScript type definitions

## Architecture & Data Model

For a comprehensive understanding of the application's data structure and entity relationships, see the [Domain Model Documentation](./DOMAIN_MODEL.md). This includes:

- Entity-Relationship Diagram (ERD) with Mermaid
- Database schema and relationships
- Application features and technology stack
- Data flow and system architecture

## TODO List

### High Priority

- [ ] **Make fully mobile responsive** - Complete mobile optimization across all pages and components
- [ ] **Fix mobile navigation** - Improve mobile menu and navigation experience
- [ ] **Add mobile-specific features** - Touch gestures, swipe actions, and mobile-optimized interactions

### Features & Functionality

- [ ] **Dark mode support** - Add dark/light theme toggle
- [ ] **Offline support** - Implement PWA features for offline usage
- [ ] **Keyboard shortcuts** - Add keyboard shortcuts for power users
- [ ] **Export functionality** - Add data export (CSV, PDF, Excel)

### UI/UX Improvements

- [ ] **Accessibility** - Improve accessibility (WCAG 2.2 compliance)
- [ ] **Error handling** - Improve error messages and user feedback

### Analytics & Reporting

- [ ] **Advanced analytics** - Add more detailed analytics and insights
- [ ] **Data visualization** - Add more chart types and visualizations

### Testing & Quality
- [ ] **Accessibility testing** - Add automated accessibility testing
- [ ] **Cross-browser testing** - Ensure compatibility across browsers


## License

This project is licensed under the MIT License.

