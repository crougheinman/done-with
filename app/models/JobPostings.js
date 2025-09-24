/**
 * JobPostings model for standardizing job posting data structure and operations
 */
import { Timestamp } from 'firebase/firestore';

class JobPostings {
  constructor(data = {}) {
    this.id = data.id || null;
    this.jobTitle = data.jobTitle || "";
    this.companyName = data.companyName || "";
    this.companyRating = data.companyRating || null;
    this.companyReviewsCount = data.companyReviewsCount || null;
    this.location = data.location || "";
    this.workSetup = data.workSetup || null; // 'Onsite' | 'Hybrid' | 'Remote'
    this.department = data.department || null;
    this.employmentType = data.employmentType || "";
    this.salary = data.salary || null;
    this.postedDate = data.postedDate || null; // string or Date
    this.applicationVolume = data.applicationVolume || null;
    this.skills = data.skills || [];
    this.responsibilities = data.responsibilities || [];
    this.requirements = data.requirements || [];
    this.educationRequirement = data.educationRequirement || null;
    this.experienceRequirement = data.experienceRequirement || null;
    this.benefits = data.benefits || [];
    this.additionalNotes = data.additionalNotes || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  /**
   * Create JobPostings instance from Firestore document
   * @param {object} docData - Firestore document data
   * @param {string} docId - Firestore document ID
   * @returns {JobPostings} JobPostings instance
   */
  static fromFirestore(docData, docId) {
    return new JobPostings({
      id: docId,
      ...docData,
      // Convert Firestore Timestamps to Date objects if needed
      createdAt: docData.createdAt?.toDate?.() || docData.createdAt,
      updatedAt: docData.updatedAt?.toDate?.() || docData.updatedAt,
      postedDate: docData.postedDate?.toDate?.() || docData.postedDate,
    });
  }

  /**
   * Convert JobPostings instance to Firestore document format
   * @returns {object} Firestore document data
   */
  toFirestore() {
    const data = {
      jobTitle: this.jobTitle,
      companyName: this.companyName,
      location: this.location,
      employmentType: this.employmentType,
      skills: this.skills,
      responsibilities: this.responsibilities,
      requirements: this.requirements,
      benefits: this.benefits,
    };

    // Only include optional fields if they have values
    if (this.companyRating !== null) {
      data.companyRating = this.companyRating;
    }
    if (this.companyReviewsCount !== null) {
      data.companyReviewsCount = this.companyReviewsCount;
    }
    if (this.workSetup) {
      data.workSetup = this.workSetup;
    }
    if (this.department) {
      data.department = this.department;
    }
    if (this.salary) {
      data.salary = this.salary;
    }
    if (this.postedDate) {
      data.postedDate = this.postedDate;
    }
    if (this.applicationVolume) {
      data.applicationVolume = this.applicationVolume;
    }
    if (this.educationRequirement) {
      data.educationRequirement = this.educationRequirement;
    }
    if (this.experienceRequirement) {
      data.experienceRequirement = this.experienceRequirement;
    }
    if (this.additionalNotes) {
      data.additionalNotes = this.additionalNotes;
    }

    // Include timestamps if they exist, converting Date objects to Timestamps
    if (this.createdAt) {
      data.createdAt = this.createdAt instanceof Date ? Timestamp.fromDate(this.createdAt) : this.createdAt;
    }
    if (this.updatedAt) {
      data.updatedAt = this.updatedAt instanceof Date ? Timestamp.fromDate(this.updatedAt) : this.updatedAt;
    }
    // Temporarily comment out postedDate to test
    // if (this.postedDate) {
    //   data.postedDate = this.postedDate instanceof Date ? Timestamp.fromDate(this.postedDate) : this.postedDate;
    // }

    return data;
  }

  /**
   * Get job posting data without sensitive information (for client-side use)
   * @returns {object} Sanitized job posting data
   */
  toPublicData() {
    return {
      id: this.id,
      jobTitle: this.jobTitle,
      companyName: this.companyName,
      companyRating: this.companyRating,
      companyReviewsCount: this.companyReviewsCount,
      location: this.location,
      workSetup: this.workSetup,
      department: this.department,
      employmentType: this.employmentType,
      salary: this.salary,
      postedDate: this.postedDate,
      applicationVolume: this.applicationVolume,
      skills: this.skills,
      responsibilities: this.responsibilities,
      requirements: this.requirements,
      educationRequirement: this.educationRequirement,
      experienceRequirement: this.experienceRequirement,
      benefits: this.benefits,
      additionalNotes: this.additionalNotes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Get formatted job title with company
   * @returns {string} Formatted job title
   */
  getFormattedTitle() {
    return `${this.jobTitle} at ${this.companyName}`;
  }

  /**
   * Get formatted location with work setup
   * @returns {string} Formatted location
   */
  getFormattedLocation() {
    if (this.workSetup) {
      return `${this.location} (${this.workSetup})`;
    }
    return this.location;
  }

  /**
   * Check if job is remote
   * @returns {boolean} True if remote work
   */
  isRemote() {
    return this.workSetup === "Remote";
  }

  /**
   * Check if job is hybrid
   * @returns {boolean} True if hybrid work
   */
  isHybrid() {
    return this.workSetup === "Hybrid";
  }

  /**
   * Check if job is onsite
   * @returns {boolean} True if onsite work
   */
  isOnsite() {
    return this.workSetup === "Onsite";
  }

  /**
   * Get work setup display text
   * @returns {string} Formatted work setup
   */
  getWorkSetupDisplay() {
    switch (this.workSetup) {
      case "Remote":
        return "🌍 Remote";
      case "Hybrid":
        return "🏢 Hybrid";
      case "Onsite":
        return "🏢 On-site";
      default:
        return "";
    }
  }

  /**
   * Check if job has salary information
   * @returns {boolean} True if salary is provided
   */
  hasSalary() {
    return !!(this.salary && this.salary.trim().length > 0);
  }

  /**
   * Get skills as comma-separated string
   * @returns {string} Skills string
   */
  getSkillsString() {
    return this.skills.join(", ");
  }

  /**
   * Get benefits as comma-separated string
   * @returns {string} Benefits string
   */
  getBenefitsString() {
    return this.benefits.join(", ");
  }

  /**
   * Check if job posting is recent (posted within last 7 days)
   * @returns {boolean} True if recent
   */
  isRecent() {
    if (!this.postedDate) return false;

    const postedDate = new Date(this.postedDate);
    const now = new Date();
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 7;
  }

  /**
   * Get time since posting
   * @returns {string} Time ago string
   */
  getTimeSincePosting() {
    if (!this.postedDate) return "";

    const postedDate = new Date(this.postedDate);
    const now = new Date();
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  /**
   * Validate job posting data
   * @returns {object} Validation result with isValid boolean and errors array
   */
  validate() {
    const errors = [];

    if (!this.jobTitle || this.jobTitle.trim().length === 0) {
      errors.push("Job title is required");
    }

    if (!this.companyName || this.companyName.trim().length === 0) {
      errors.push("Company name is required");
    }

    if (!this.location || this.location.trim().length === 0) {
      errors.push("Location is required");
    }

    if (!this.employmentType || this.employmentType.trim().length === 0) {
      errors.push("Employment type is required");
    }

    if (
      this.workSetup &&
      !["Onsite", "Hybrid", "Remote"].includes(this.workSetup)
    ) {
      errors.push("Work setup must be 'Onsite', 'Hybrid', or 'Remote'");
    }

    if (this.skills.length === 0) {
      errors.push("At least one skill is required");
    }

    if (this.responsibilities.length === 0) {
      errors.push("At least one responsibility is required");
    }

    if (this.requirements.length === 0) {
      errors.push("At least one requirement is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Update job posting timestamp
   */
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}

export default JobPostings;
