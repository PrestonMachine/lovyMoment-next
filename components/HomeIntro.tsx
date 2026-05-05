/**
 * Long-form intro section, rendered at the bottom of the homepage (after
 * the catalogue, before the footer). Two purposes:
 *
 *   1. SEO — pads the word count, reuses the keywords from the page title
 *      and H1, ships proper `<p>` paragraphs.
 *   2. UX — closes the visit with a clear pitch ("here's who we are, what
 *      we offer, how to book") so the user has a takeaway after scrolling
 *      through the products.
 *
 * Server component, locale-aware. Visual style picks up the brand blue
 * (#4f66cf) with a soft gradient backdrop so the section reads as a hero
 * for the closing CTA — different enough from the white product grid not
 * to blur into it.
 */
import type { Locale } from '@/types';

interface Props {
  locale: Locale;
}

const COPY: Record<Locale, {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  features: { num: string; heading: string; text: string }[];
}> = {
  uk: {
    eyebrow: 'Lovy Moment · Львів',
    title: 'Свята, які запам’ятовуються',
    paragraphs: [
      'Lovy Moment — це команда професіоналів із понад 10-річним досвідом організації яскравих та незабутніх свят у Львові й області. Ми створюємо атмосферу, де кожен момент — від найменшого жесту до головного сюрпризу — стає особливим. Атракціони, аніматори, ігри, кейтеринг — усе, що потрібно для ідеального дитячого свята, корпоративу, фестивалю чи дня народження, ми привозимо, монтуємо й обслуговуємо.',
      'Наші атракціони — це безпечні та сертифіковані надувні гірки, батутні комплекси, лабіринти й інше обладнання, яке адаптується під будь-який майданчик у Львові та області. Ми доставляємо все на місце, готуємо до запуску, обслуговуємо протягом події та забираємо після завершення. Ваше завдання — насолоджуватися святом разом із гостями, а не думати про логістику.',
      'Аніматори Lovy Moment — це харизматичні актори з улюбленими дитячими персонажами, які проводять сценарні програми, майстер-класи, інтерактивні квести та командні ігри. Кожен сценарій підлаштовується під вік дітей і тематику заходу — будь то день народження, випускний у дитячому садку чи корпоратив для дорослих із родинами.'
    ],
    features: [
      { num: '01', heading: 'Дитячі свята', text: 'Дні народження, випускні, тематичні вечірки. Атракціони, ігри, аніматори у костюмах, солодка вата та попкорн — усе одним замовленням.' },
      { num: '02', heading: 'Корпоративи', text: 'Тімбілдинги, ділові свята, виїзди для родин співробітників. Сценарій, активності, кейтеринг — підлаштовуємо під ваш бюджет і формат.' },
      { num: '03', heading: 'Фестивалі та промо', text: 'Великі надувні комплекси, мега-ігри, інтерактивні зони для брендових акцій. Працюємо як на закритих, так і на відкритих майданчиках.' },
      { num: '04', heading: 'Безпека і якість', text: 'Усе обладнання сертифіковане, регулярно перевіряється та обслуговується. Поряд із дітьми завжди працює інструктор.' }
    ]
  },
  en: {
    eyebrow: 'Lovy Moment · Lviv',
    title: 'Events you’ll remember',
    paragraphs: [
      'Lovy Moment is a team of professionals with 10+ years of experience organising bright and memorable events in Lviv and the region. We create an atmosphere where every moment — from the smallest gesture to the headline surprise — becomes special. Attractions, animators, games, catering — everything you need for the perfect kids party, corporate event, festival or birthday is delivered, set up and supervised by us.',
      'Our attractions are safe, certified inflatable slides, trampoline complexes, mazes and other equipment that adapts to any venue in Lviv and the region. We deliver everything on-site, prep it for launch, supervise during the event and pack it up afterwards. Your only job is to enjoy the celebration with your guests instead of worrying about logistics.',
      'Lovy Moment animators are charismatic actors playing favourite kids characters. They run scripted programmes, master-classes, interactive quests and team games. Every script is tailored to the children\'s age and the event theme — be it a birthday, a kindergarten graduation, or a corporate event for adults and their families.'
    ],
    features: [
      { num: '01', heading: 'Kids parties', text: 'Birthdays, graduations, themed parties. Attractions, games, costumed animators, cotton candy and popcorn — all in one booking.' },
      { num: '02', heading: 'Corporate events', text: 'Team-building, business parties, off-sites for employees and their families. Scripts, activities and catering tuned to your budget.' },
      { num: '03', heading: 'Festivals & brands', text: 'Large inflatable complexes, mega games, interactive zones for brand activations. We work indoor and outdoor venues alike.' },
      { num: '04', heading: 'Safety & quality', text: 'All equipment is certified and regularly inspected. A trained instructor is always on duty next to the kids.' }
    ]
  }
};

export function HomeIntro({ locale }: Props) {
  const c = COPY[locale];

  return (
    <section
      aria-label={c.title}
      style={{
        marginTop: 80,
        padding: '64px 16px 56px',
        background:
          'radial-gradient(circle at 20% 0%, rgba(79,102,207,0.08) 0%, transparent 60%), radial-gradient(circle at 90% 100%, rgba(245,93,93,0.06) 0%, transparent 55%), #fbfbff',
        borderTop: '1px solid #eef0fa',
        fontFamily: 'Rubik, sans-serif',
        color: '#1a1a1a',
        lineHeight: 1.65
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Eyebrow + title */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(79,102,207,0.12)',
              color: '#4f66cf',
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 16
            }}
          >
            {c.eyebrow}
          </span>
          <h2
            style={{
              fontSize: 'clamp(28px, 4.5vw, 44px)',
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.15,
              backgroundImage: 'linear-gradient(135deg, #4f66cf 0%, #7c8ce5 60%, #f55d5d 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            {c.title}
          </h2>
        </div>

        {/* Prose paragraphs */}
        <div
          style={{
            maxWidth: 880,
            margin: '0 auto 48px',
            fontSize: 16,
            color: '#374151'
          }}
        >
          {c.paragraphs.map((p, i) => (
            <p key={i} style={{ margin: '0 0 16px' }}>
              {p}
            </p>
          ))}
        </div>

        {/* Numbered feature grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20
          }}
        >
          {c.features.map((f) => (
            <div
              key={f.num}
              style={{
                position: 'relative',
                background: '#ffffff',
                borderRadius: 16,
                padding: '24px 22px 22px',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                border: '1px solid #eef0fa',
                overflow: 'hidden'
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: -10,
                  right: -4,
                  fontSize: 64,
                  fontWeight: 800,
                  color: 'rgba(79,102,207,0.08)',
                  lineHeight: 1
                }}
              >
                {f.num}
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: '#1a1a1a' }}>
                {f.heading}
              </h3>
              <p style={{ margin: 0, fontSize: 14, color: '#4b5563' }}>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
