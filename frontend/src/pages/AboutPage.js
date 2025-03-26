import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  }
`;

const PageTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  color: var(--text-muted);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const AboutSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const AboutContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }
`;

const AboutImage = styled.div`
  height: 100%;
  min-height: 400px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 3rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  i {
    font-size: 3rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  h3 {
    font-family: 'Playfair Display', serif;
    margin-bottom: 1rem;
    font-size: 1.4rem;
    color: var(--dark-color);
  }

  p {
    color: var(--text-color);
    line-height: 1.6;
  }
`;

const TeamSection = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  }

  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const TeamMember = styled.div`
  background-color: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const MemberImage = styled.div`
  height: 260px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${TeamMember}:hover & img {
    transform: scale(1.05);
  }
`;

const MemberInfo = styled.div`
  padding: 1.5rem;
  text-align: center;
`;

const MemberName = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--dark-color);
  margin-bottom: 0.5rem;
`;

const MemberRole = styled.p`
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1rem;
`;

const MemberBio = styled.p`
  color: var(--text-color);
  font-size: 0.9rem;
  line-height: 1.6;
`;

const CtaSection = styled.div`
  background:
    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')
      center/cover no-repeat;
  padding: 4rem 2rem;
  color: white;
  text-align: center;
  border-radius: var(--radius-md);

  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    max-width: 600px;
    margin: 0 auto 2rem auto;
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    background-color: var(--accent-color);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const AboutPage = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Анна Соколова',
      role: 'Генеральный директор',
      bio: 'Более 15 лет опыта в гостиничном бизнесе. Создала "Лесной Дворик" с идеей объединить комфорт и единение с природой.',
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1588&q=80',
    },
    {
      id: 2,
      name: 'Михаил Иванов',
      role: 'Шеф-повар',
      bio: 'Известный шеф-повар с международным опытом. Специализируется на блюдах из локальных продуктов с современным подходом.',
      image:
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=768&q=80',
    },
    {
      id: 3,
      name: 'Елена Петрова',
      role: 'Администратор',
      bio: 'Заботится о комфорте каждого гостя. Знает все тонкости сервиса и всегда готова помочь с любыми вопросами.',
      image:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80',
    },
    {
      id: 4,
      name: 'Алексей Смирнов',
      role: 'СПА-менеджер',
      bio: 'Сертифицированный специалист по массажу и СПА-процедурам. Разработал уникальные программы для гостей отеля.',
      image:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
    },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>О нашем отеле</PageTitle>
        <PageSubtitle>
          Познакомьтесь с историей "Лесного Дворика", нашей философией и командой, которая делает
          ваш отдых незабываемым
        </PageSubtitle>
      </PageHeader>

      <AboutSection>
        <AboutContent>
          <h2>История "Лесного Дворика"</h2>
          <p>
            Отель "Лесной Дворик" был основан в 2010 году с идеей создать уникальное место, где
            городские жители могли бы отдохнуть от суеты и насладиться красотой русской природы, не
            отказываясь от комфорта.
          </p>
          <p>
            Расположенный в живописном месте, окруженном вековыми соснами и елями, наш отель
            предлагает своим гостям роскошные номера с панорамными видами на лес, ресторан с
            авторской кухней из экологически чистых продуктов, а также множество развлечений и
            оздоровительных процедур.
          </p>
          <p>
            За годы работы "Лесной Дворик" заслужил репутацию одного из лучших мест для семейного
            отдыха и романтического уединения. Мы гордимся тем, что многие гости возвращаются к нам
            снова и снова, чтобы вновь ощутить особую атмосферу нашего отеля.
          </p>
        </AboutContent>
        <AboutImage>
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
            alt="Отель Лесной Дворик"
          />
        </AboutImage>
      </AboutSection>

      <SectionTitle>Наши ценности</SectionTitle>
      <ValueGrid>
        <ValueCard>
          <i className="fas fa-leaf"></i>
          <h3>Экологичность</h3>
          <p>
            Мы стремимся минимизировать наше воздействие на окружающую среду, используя экологически
            чистые материалы и технологии.
          </p>
        </ValueCard>
        <ValueCard>
          <i className="fas fa-heart"></i>
          <h3>Забота о гостях</h3>
          <p>
            Мы внимательны к каждой детали и делаем всё возможное, чтобы ваш отдых был комфортным и
            запоминающимся.
          </p>
        </ValueCard>
        <ValueCard>
          <i className="fas fa-home"></i>
          <h3>Уют и комфорт</h3>
          <p>
            Наши номера и общественные пространства созданы так, чтобы вы чувствовали себя как дома,
            но лучше.
          </p>
        </ValueCard>
      </ValueGrid>

      <TeamSection>
        <SectionTitle>Наша команда</SectionTitle>
        <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}>
          Познакомьтесь с профессионалами, которые делают ваш отдых в "Лесном Дворике" особенным.
          Наша команда всегда готова обеспечить вам высокий уровень сервиса и заботы.
        </p>
        <TeamGrid>
          {teamMembers.map(member => (
            <TeamMember key={member.id}>
              <MemberImage>
                <img src={member.image} alt={member.name} />
              </MemberImage>
              <MemberInfo>
                <MemberName>{member.name}</MemberName>
                <MemberRole>{member.role}</MemberRole>
                <MemberBio>{member.bio}</MemberBio>
              </MemberInfo>
            </TeamMember>
          ))}
        </TeamGrid>
      </TeamSection>

      <CtaSection>
        <h2>Готовы отдохнуть в "Лесном Дворике"?</h2>
        <p>Забронируйте номер прямо сейчас и получите скидку 10% на СПА-процедуры</p>
        <Button to="/rooms">Выбрать номер</Button>
      </CtaSection>
    </PageContainer>
  );
};

export default AboutPage;
