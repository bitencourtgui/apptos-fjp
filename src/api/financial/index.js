import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import { firebaseApp } from "../../libs/firebase";

const db = getFirestore(firebaseApp);
const processCollection = "financial";

class FinancialApi {
  static async getInvoices(id) {
    const invoicesRef = doc(db, processCollection, id.toString());

    try {
      let data = await getDoc(invoicesRef);

      if (data.exists()) {
        data = { ...data.data(), id: data.id };
      }

      return Promise.resolve({
        data,
      });
    } catch (error) {
      console.error("Erro ao buscar o documento:", error);
    }
  }

  static async setInvoices(id, data) {
    const invoicesRef = doc(db, processCollection, id.toString());

    try {
      await setDoc(invoicesRef, data);

      return {
        status: 200,
        res: "success",
      };
    } catch (error) {
      console.error("Erro ao buscar o documento:", error);
      return {
        status: 901,
        res: `Erro: ${error}`,
      };
    }
  }

  static async deleteInvoice(customerId, invoiceId) {
    const invoicesRef = doc(db, processCollection, customerId.toString());

    try {
      const financialSnapshot = await getDoc(invoicesRef);

      if (financialSnapshot.exists()) {
        const financialData = financialSnapshot.data();

        const updatedPayments = financialData.payments.filter(
          (payment) => payment.id !== invoiceId
        );

        await updateDoc(invoicesRef, { payments: updatedPayments });

        return {
          status: 200,
          res: "success",
        };
      }
    } catch (error) {
      console.error("Movimentação não encontrada:", error);

      return {
        status: 901,
        res: `Erro: ${error}`,
      };
    }
  }

  static async updateInvoiceStatus(customerId, invoiceId) {
    const invoicesRef = doc(db, processCollection, customerId.toString());

    try {
      const docSnapshot = await getDoc(invoicesRef);

      if (docSnapshot.exists()) {
        const updatedPayments = docSnapshot.data()?.payments.map((payment) => ({
          ...payment,
          installments: payment.installments.map((inst) => ({
            ...inst,
            installmentStatus:
              inst.installmentsId === invoiceId
                ? inst.installmentStatus === "Pago"
                  ? "Pendente"
                  : "Pago"
                : inst.installmentStatus,
          })),
        }));

        await updateDoc(invoicesRef, { payments: updatedPayments });

        return {
          status: 200,
          res: "success",
        };
      }
    } catch (error) {
      console.error("Erro ao buscar o documento:", error);

      return {
        status: 901,
        res: `Erro: ${error}`,
      };
    }
  }
}

export default FinancialApi;
