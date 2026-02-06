-- Migration: Canadian Services Seed
-- Description: Populates the catalog with detailed Canadian visa services and market rates.
-- 1. Remove placeholder if exists (optional, safely)
DELETE FROM immigration_service_catalog
WHERE code = 'CAN_PR';
-- 2. Insert Canadian Services
INSERT INTO immigration_service_catalog (
        title,
        code,
        description,
        price,
        currency,
        processing_time,
        icon_name,
        requirements
    )
VALUES (
        'Canada Visitor Visa (TRV)',
        'CAN_VISITOR',
        'Temporary Resident Visa for tourism or visiting family. Includes application review and submission.',
        185.00,
        'CAD',
        '15-30 Days',
        'Plane',
        '["Passport", "Digital Photo", "Proof of Funds", "Travel Itinerary", "Invitation Letter (if applicable)"]'
    ),
    (
        'Super Visa (Parents/Grandparents)',
        'CAN_SUPER',
        'Long-term multi-entry visa for parents and grandparents. Valid for up to 10 years.',
        250.00,
        'CAD',
        '2-4 Months',
        'Stamp',
        '["Passport", "Proof of Relationship", "Medical Exam", "Canadian Medical Insurance", "Sponsor Income Proof"]'
    ),
    (
        'Study Permit',
        'CAN_STUDY',
        'For international students with an acceptance letter from a DLI.',
        200.00,
        'CAD',
        '4-8 Weeks',
        'FileText',
        '["Acceptance Letter (DLI)", "Proof of Funds", "Passport", "Photos", "Study Plan"]'
    ),
    (
        'Work Permit (Open/LMIA-Exempt)',
        'CAN_WORK_OPEN',
        'Assistance with Open Work Permits or LMIA-exempt specific permits.',
        255.00,
        'CAD',
        '2-4 Months',
        'Briefcase',
        '["Job Offer (if applicable)", "Passport", "CV/Resume", "Education/Experience Proof"]'
    ),
    (
        'PGWP (Post-Grad Work Permit)',
        'CAN_PGWP',
        'Work permit for graduates of eligible Canadian Designated Learning Institutions.',
        255.00,
        'CAD',
        '3-5 Months',
        'GraduationCap',
        '["Final Transcript", "Completion Letter", "Passport", "Photo"]'
    ),
    (
        'Express Entry Profile Setup',
        'CAN_EE_PROFILE',
        'Professional profile creation and optimization for FSW, CEC, or FST programs.',
        300.00,
        'CAD',
        '1 Week',
        'MapPin',
        '["ECA Report", "IELTS/CELPIP Score", "Passport", "Work Experience Letters"]'
    ),
    (
        'Spousal Sponsorship (Service Fee)',
        'CAN_SPOUSAL',
        'Comprehensive guidance for inland or outland spousal sponsorship applications.',
        500.00,
        'CAD',
        '12 Months',
        'Heart',
        '["Marriage Certificate", "Relationship Proofs (Photos, Chats)", "Sponsor Income Proof", "Medical/Police Clearance"]'
    ),
    (
        'Canadian Citizenship',
        'CAN_CITIZEN',
        'Application for grant of citizenship for eligible permanent residents.',
        630.00,
        'CAD',
        '12-14 Months',
        'Flag',
        '["PR Card", "Physical Presence calculation", "Language Proof", "Tax Filings", "Photos"]'
    ) ON CONFLICT (code) DO
UPDATE
SET price = EXCLUDED.price,
    description = EXCLUDED.description,
    requirements = EXCLUDED.requirements,
    title = EXCLUDED.title;