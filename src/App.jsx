import { useRef, useState } from 'react'
import { supabase } from './lib/supabase'

const CLASSES = [
  'Play Group', 'Nursery', 'Prep',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
]

const EMPTY = {
  student_name: '', father_name: '', date_of_birth: '', gender: '',
  class_applying_for: '', previous_school: '', guardian_phone: '',
  guardian_email: '', address: '', city: 'Karachi', notes: '', website: ''
}

function validate(f) {
  const e = {}
  if (f.student_name.trim().length < 2) e.student_name = "Enter the student's full name"
  if (f.father_name.trim().length < 2) e.father_name = "Enter the father's / guardian's name"
  if (!f.date_of_birth) e.date_of_birth = 'Select the date of birth'
  else if (f.date_of_birth > new Date().toISOString().slice(0, 10)) e.date_of_birth = 'Date cannot be in the future'
  else if (f.date_of_birth < '2005-01-01') e.date_of_birth = 'Please check the date of birth'
  if (!f.gender) e.gender = 'Select gender'
  if (!f.class_applying_for) e.class_applying_for = 'Select a class'
  if (!/^[0-9+\-\s]{10,20}$/.test(f.guardian_phone.trim())) e.guardian_phone = 'Enter a valid phone number (e.g. 0300-1234567)'
  if (f.guardian_email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.guardian_email.trim())) e.guardian_email = 'Enter a valid email or leave blank'
  if (f.address.trim().length < 5) e.address = 'Enter the home address'
  if (f.city.trim().length < 2) e.city = 'Enter the city'
  return e
}

function Field({ label, error, optional, children }) {
  return (
    <label className="field">
      <span className="label">{label}{optional && <em> (optional)</em>}</span>
      {children}
      {error && <span className="error" role="alert">{error}</span>}
    </label>
  )
}

export default function App() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverError, setServerError] = useState('')
  const [reference, setReference] = useState('')
  const openedAt = useRef(Date.now())

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    if (status === 'submitting') return
    setServerError('')

    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.querySelector('.field .error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const id = crypto.randomUUID()
    const ref = 'AN-' + id.slice(0, 8).toUpperCase()

    // Honeypot: bots fill the hidden field. Pretend success, store nothing.
    if (form.website) { setReference(ref); setStatus('success'); return }
    if (Date.now() - openedAt.current < 2500) {
      setServerError('Please review your details and press submit again.')
      return
    }
    if (!supabase) {
      setServerError('The form is not configured yet. Please contact the school office.')
      return
    }

    setStatus('submitting')
    const { error } = await supabase.from('admission_applications').insert({
      id,
      student_name: form.student_name.trim(),
      father_name: form.father_name.trim(),
      date_of_birth: form.date_of_birth,
      gender: form.gender,
      class_applying_for: form.class_applying_for,
      previous_school: form.previous_school.trim() || null,
      guardian_phone: form.guardian_phone.trim(),
      guardian_email: form.guardian_email.trim() || null,
      address: form.address.trim(),
      city: form.city.trim(),
      notes: form.notes.trim() || null
    })

    if (error) {
      setStatus('idle')
      setServerError(
        error.message?.includes('Too many')
          ? 'Too many applications from this phone number. Please try again later.'
          : 'We could not submit your application. Please try again or call the school office.'
      )
      return
    }
    setReference(ref)
    setStatus('success')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function reset() {
    setForm(EMPTY); setErrors({}); setStatus('idle'); setServerError('')
    openedAt.current = Date.now()
  }

  return (
    <>
      <header className="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#top"><span aria-hidden>🎓</span> Al-Noor Model School</a>
          <a className="btn btn-sm" href="#apply">Apply Now</a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <p className="kicker">Admissions Open 2027-28</p>
            <h1>Where every child's future begins</h1>
            <p className="lead">Quality education from Play Group to Class 10 in the heart of Karachi. Apply online in about two minutes.</p>
            <a className="btn" href="#apply">Start Application</a>
            <ul className="stats">
              <li><strong>25+</strong><span>Years of teaching</span></li>
              <li><strong>1:20</strong><span>Teacher-student ratio</span></li>
              <li><strong>Play Group - 10</strong><span>Classes offered</span></li>
            </ul>
          </div>
        </section>

        <section className="wrap features">
          {[
            ['📚', 'Strong academics', 'Balanced curriculum with English, Urdu, Mathematics, Science and Islamiyat.'],
            ['🧑‍🏫', 'Caring teachers', 'Small classes so every student gets personal attention.'],
            ['⚽', 'Activities', 'Sports, art, and science fairs that build confidence.']
          ].map(([i, t, d]) => (
            <article key={t} className="card"><div className="icon">{i}</div><h3>{t}</h3><p>{d}</p></article>
          ))}
        </section>

        <section id="apply" className="wrap apply">
          <div className="panel">
            {status === 'success' ? (
              <div className="success" role="status">
                <div className="tick">✓</div>
                <h2>Application received</h2>
                <p>Thank you. Our admissions office will contact you on the phone number you provided.</p>
                <p className="ref">Reference number <strong>{reference}</strong></p>
                <button className="btn" onClick={reset}>Submit another application</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <h2>Admission Application</h2>
                <p className="sub">Fields marked with an asterisk are required.</p>

                {serverError && <div className="alert" role="alert">{serverError}</div>}

                <div className="grid">
                  <Field label="Student's full name *" error={errors.student_name}>
                    <input value={form.student_name} onChange={set('student_name')} autoComplete="off" maxLength={100} />
                  </Field>
                  <Field label="Father's / guardian's name *" error={errors.father_name}>
                    <input value={form.father_name} onChange={set('father_name')} autoComplete="off" maxLength={100} />
                  </Field>
                  <Field label="Date of birth *" error={errors.date_of_birth}>
                    <input type="date" value={form.date_of_birth} onChange={set('date_of_birth')} max={new Date().toISOString().slice(0, 10)} />
                  </Field>
                  <Field label="Gender *" error={errors.gender}>
                    <select value={form.gender} onChange={set('gender')}>
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </Field>
                  <Field label="Class applying for *" error={errors.class_applying_for}>
                    <select value={form.class_applying_for} onChange={set('class_applying_for')}>
                      <option value="">Select</option>
                      {CLASSES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Previous school" optional>
                    <input value={form.previous_school} onChange={set('previous_school')} maxLength={150} />
                  </Field>
                  <Field label="Guardian's phone *" error={errors.guardian_phone}>
                    <input type="tel" inputMode="tel" placeholder="0300-1234567" value={form.guardian_phone} onChange={set('guardian_phone')} maxLength={20} />
                  </Field>
                  <Field label="Guardian's email" optional error={errors.guardian_email}>
                    <input type="email" value={form.guardian_email} onChange={set('guardian_email')} maxLength={120} />
                  </Field>
                  <Field label="Home address *" error={errors.address}>
                    <input value={form.address} onChange={set('address')} maxLength={300} />
                  </Field>
                  <Field label="City *" error={errors.city}>
                    <input value={form.city} onChange={set('city')} maxLength={60} />
                  </Field>
                </div>

                <Field label="Anything else we should know?" optional>
                  <textarea rows={3} value={form.notes} onChange={set('notes')} maxLength={1000} />
                </Field>

                {/* honeypot - hidden from people */}
                <div className="hp" aria-hidden="true">
                  <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} /></label>
                </div>

                <button className="btn btn-block" type="submit" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <p>© {new Date().getFullYear()} Al-Noor Model School, Karachi. Demo project - not a real school.</p>
        </div>
      </footer>
    </>
  )
}
