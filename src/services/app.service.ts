import HttpService from './http.service';

// Методи API проєкту. Кожен метод — тонка обгортка: шлях, перетворення даних
// форми в тіло запиту, тип відповіді. Типи запитів і відповідей — у
// src/types/<домен>.types.ts. Приклад:
//
//   async createFeedback(data: IFeedbackFormData): Promise<unknown> {
//     const response = await this.post<unknown, IFeedbackRequest>(
//       { url: 'feedback', data: toFeedbackRequest(data) },
//       false
//     );
//
//     return response.data;
//   }
//
// Другий аргумент — withAuth: false для публічних ендпоінтів (форма
// зворотного звʼязку), інакше до запиту додається Bearer-токен.
class AppService extends HttpService {}

const appService = new AppService();

export default appService;
