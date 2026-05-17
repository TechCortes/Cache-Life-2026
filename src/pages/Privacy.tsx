import Layout from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { PRIVACY_POLICY_VERSION } from "@/lib/consent";

const Privacy = () => (
  <Layout>
    <Helmet>
      <title>Privacy Policy — Caché Life</title>
      <meta
        name="description"
        content="How Caché Life collects, uses, stores, and protects the personal information of subscribers and event guests."
      />
      <link rel="canonical" href="https://cachelifeny.com/privacy" />
    </Helmet>

    <article className="max-w-3xl mx-auto px-6 py-24 text-foreground">
      <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
        Version {PRIVACY_POLICY_VERSION}
      </p>
      <h1 className="text-4xl md:text-5xl font-serif mb-10">Privacy Policy</h1>

      <div className="space-y-10 text-sm md:text-base leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-xl font-serif text-foreground mb-3">What we collect</h2>
          <p>
            When you join our list or RSVP to a gathering, we collect the
            information you submit: your name, email address, and phone number,
            along with the event you RSVP'd to (if any) and the date of
            submission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-foreground mb-3">Why we collect it</h2>
          <p>
            We use this information solely to confirm your reservation, send
            you details about the events you signed up for, and occasionally
            invite you to future Caché Life experiences. We do not sell or
            rent your data to anyone.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-foreground mb-3">Where it lives</h2>
          <p>
            Subscriber data is stored in a secure backend protected by strict
            access controls. Only authorized Caché Life team members with the
            admin role can view it. The application is served over HTTPS and
            data is encrypted at rest.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-foreground mb-3">How long we keep it</h2>
          <p>
            We retain subscriber information for as long as you remain on the
            list. You can request deletion at any time (see below) and we
            periodically purge inactive records.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-foreground mb-3">Your rights</h2>
          <p>
            You can request a copy of the personal information we hold about
            you, ask us to correct it, or ask us to delete it entirely. Email{" "}
            <a
              href="mailto:hello@cachelifeny.com"
              className="text-foreground underline underline-offset-4 hover:opacity-80"
            >
              hello@cachelifeny.com
            </a>{" "}
            from the address you signed up with and we will action your
            request within a reasonable timeframe.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-foreground mb-3">Third parties</h2>
          <p>
            Some events are ticketed through Posh.vip or Partiful. If you
            choose to complete a reservation on one of those platforms, their
            own privacy policy applies to the information you submit there.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-serif text-foreground mb-3">Changes</h2>
          <p>
            If we materially change how we handle your data, we will publish
            a new version of this policy and update the version number at the
            top of this page.
          </p>
        </section>
      </div>
    </article>
  </Layout>
);

export default Privacy;
