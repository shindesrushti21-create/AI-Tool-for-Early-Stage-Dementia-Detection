import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Users } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const TeamPage = () => {
  const teamMembers = [
    {
      name: 'Dr. Namrata Salgar',
      role: 'Lead Healthcare AI Researcher & Founder',
      bio: 'Specialist in geriatric cognitive impairment algorithms and non-invasive acoustic voice biomarker detection.',
      photo: 'https://images.unsplash.com/photo-1594824813566-78a9c37965c4?auto=format&fit=crop&w=400&q=80',
      alt: 'Portrait of Dr. Namrata Salgar wearing medical white coat and smiling'
    },
    {
      name: 'Prof. Rajesh Kulkarni',
      role: 'Clinical Geriatric Neurologist',
      bio: 'Head of Senior Neuro-Care at Pune Medical Research Institute with over 22 years of early dementia clinical experience.',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      alt: 'Portrait of Prof. Rajesh Kulkarni in clinical consultation room'
    },
    {
      name: 'Priya Sundaram',
      role: 'NGO Field Operations Lead',
      bio: 'Coordinates rural community screening camps and vernacular speech translation modules across Maharashtra and Tamil Nadu.',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      alt: 'Portrait of Priya Sundaram holding a digital tablet in a health outreach center'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Healthcare Team & Medical Advisors — CogniGuard</title>
        <meta name="description" content="Meet the NGO team of geriatric specialists, AI researchers, and community health officers behind CogniGuard." />
      </Helmet>

      <div className="main-container">
        <Breadcrumbs />

        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.25rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--color-brand-teal-light)', color: 'var(--color-brand-teal-dark)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Users size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
            Meet Our NGO Team & Medical Board
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Dedicated clinicians, AI engineers, and community health officers working together to make early dementia screening universally accessible.
          </p>
        </div>

        {/* TEAM PHOTO GRID — Checklist Items #20 & #16 */}
        <div className="grid-3" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
          {teamMembers.map((member, idx) => (
            <div key={idx} className="card" style={{ padding: '0', overflow: 'hidden', textAlign: 'center' }}>
              <img
                src={member.photo}
                alt={member.alt}
                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1.25rem 1.35rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-heading)', marginBottom: '0.2rem' }}>
                  {member.name}
                </h3>
                <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--color-brand-teal)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.6rem' }}>
                  {member.role}
                </span>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
