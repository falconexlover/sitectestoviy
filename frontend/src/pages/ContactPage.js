import React, { useState } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const InfoCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--dark-color);
    margin-bottom: 1.5rem;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 2px;
      background-color: var(--accent-color);
    }
  }
`;

const ContactDetail = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.2rem;

  &:last-child {
    margin-bottom: 0;
  }

  i {
    color: var(--primary-color);
    font-size: 1.2rem;
    margin-right: 1rem;
    margin-top: 0.2rem;
  }

  div {
    flex: 1;
  }

  h4 {
    font-weight: 600;
    margin-bottom: 0.3rem;
    color: var(--dark-color);
  }

  p {
    color: var(--text-color);
    line-height: 1.5;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: var(--transition);

    &:hover {
      color: var(--accent-color);
      text-decoration: underline;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--light-color);
  color: var(--primary-color);
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-color);
    color: white;
    transform: translateY(-3px);
  }

  i {
    font-size: 1.2rem;
  }
`;

const MapContainer = styled.div`
  height: 300px;
  margin-top: 2rem;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const ContactForm = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--dark-color);
    margin-bottom: 1.5rem;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 2px;
      background-color: var(--accent-color);
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--dark-color);
`;

const Input = styled(Field)`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--light-color);
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(33, 113, 72, 0.2);
  }
`;

const TextArea = styled(Field)`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: var(--light-color);
  transition: var(--transition);
  min-height: 150px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(33, 113, 72, 0.2);
  }
`;

const Error = styled.div`
  color: var(--danger-color);
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  width: 100%;

  &:hover {
    background-color: var(--accent-color);
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Alert = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--radius-sm);
  background-color: ${props =>
    props.success ? 'rgba(33, 113, 72, 0.1)' : 'rgba(220, 53, 69, 0.1)'};
  color: ${props => (props.success ? 'var(--success-color)' : 'var(--danger-color)')};
  display: flex;
  align-items: center;

  i {
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

const phoneRegex = /^\+?[0-9()-]{10,15}$/;

const ContactPage = () => {
  const [formStatus, setFormStatus] = useState(null);

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Пожалуйста, введите ваше имя'),
    email: Yup.string().email('Неверный формат email').required('Пожалуйста, введите email'),
    phone: Yup.string()
      .matches(phoneRegex, 'Неверный формат телефона')
      .required('Пожалуйста, введите телефон'),
    subject: Yup.string().required('Пожалуйста, выберите тему сообщения'),
    message: Yup.string().required('Пожалуйста, введите сообщение'),
  });

  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    // Имитация отправки сообщения
    setTimeout(() => {
      console.log('Форма отправлена:', values);
      setFormStatus({
        success: true,
        message: 'Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.',
      });
      resetForm();
      setSubmitting(false);

      // Сбросить статус через 5 секунд
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    }, 1000);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Контакты</PageTitle>
        <PageSubtitle>
          Свяжитесь с нами для получения дополнительной информации или бронирования
        </PageSubtitle>
      </PageHeader>

      <ContactGrid>
        <ContactInfo>
          <InfoCard>
            <h3>Как с нами связаться</h3>

            <ContactDetail>
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h4>Адрес</h4>
                <p>
                  Московская область, Одинцовский район, поселок Лесные поляны, ул. Сосновая, 15
                </p>
              </div>
            </ContactDetail>

            <ContactDetail>
              <i className="fas fa-phone-alt"></i>
              <div>
                <h4>Телефон</h4>
                <p>
                  <a href="tel:+74984831941">+7 (498) 483-19-41</a> - Ресепшн
                  <br />
                  <a href="tel:+74984831942">+7 (498) 483-19-42</a> - Бронирование
                </p>
              </div>
            </ContactDetail>

            <ContactDetail>
              <i className="fas fa-envelope"></i>
              <div>
                <h4>Email</h4>
                <p>
                  <a href="mailto:info@lesnoydvorik.ru">info@lesnoydvorik.ru</a> - Общие вопросы
                  <br />
                  <a href="mailto:booking@lesnoydvorik.ru">booking@lesnoydvorik.ru</a> -
                  Бронирование
                </p>
              </div>
            </ContactDetail>

            <ContactDetail>
              <i className="fas fa-clock"></i>
              <div>
                <h4>Режим работы</h4>
                <p>
                  Заезд: с 14:00
                  <br />
                  Выезд: до 12:00
                  <br />
                  Ресепшн: 24/7
                </p>
              </div>
            </ContactDetail>

            <SocialLinks>
              <SocialLink href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </SocialLink>
              <SocialLink href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </SocialLink>
              <SocialLink href="#" aria-label="VK">
                <i className="fab fa-vk"></i>
              </SocialLink>
              <SocialLink href="#" aria-label="Telegram">
                <i className="fab fa-telegram-plane"></i>
              </SocialLink>
            </SocialLinks>
          </InfoCard>

          <MapContainer>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1125.6675758780342!2d37.29718621558629!3d55.67889444532309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54c71e172e469%3A0x5f1d59e03e562b39!2z0JvQtdGB0L3QvtC5INCe0YLQtdC70Yw!5e0!3m2!1sru!2sru!4v1710702436272!5m2!1sru!2sru"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Карта отеля Лесной Дворик"
            ></iframe>
          </MapContainer>
        </ContactInfo>

        <ContactForm>
          <h3>Отправить сообщение</h3>

          {formStatus && (
            <Alert success={formStatus.success}>
              <i
                className={`fas ${formStatus.success ? 'fa-check-circle' : 'fa-exclamation-circle'}`}
              ></i>
              {formStatus.message}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormGroup>
                  <Label htmlFor="name">Имя *</Label>
                  <Input type="text" id="name" name="name" placeholder="Введите ваше имя" />
                  <ErrorMessage name="name" component={Error} />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">Email *</Label>
                  <Input type="email" id="email" name="email" placeholder="Введите ваш email" />
                  <ErrorMessage name="email" component={Error} />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Введите ваш номер телефона"
                  />
                  <ErrorMessage name="phone" component={Error} />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="subject">Тема *</Label>
                  <Input as="select" id="subject" name="subject">
                    <option value="">Выберите тему сообщения</option>
                    <option value="booking">Бронирование</option>
                    <option value="info">Информация о номерах</option>
                    <option value="services">Дополнительные услуги</option>
                    <option value="feedback">Отзыв о проживании</option>
                    <option value="other">Другое</option>
                  </Input>
                  <ErrorMessage name="subject" component={Error} />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="message">Сообщение *</Label>
                  <TextArea
                    as="textarea"
                    id="message"
                    name="message"
                    placeholder="Введите ваше сообщение"
                  />
                  <ErrorMessage name="message" component={Error} />
                </FormGroup>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
                </Button>
              </Form>
            )}
          </Formik>
        </ContactForm>
      </ContactGrid>
    </PageContainer>
  );
};

export default ContactPage;
