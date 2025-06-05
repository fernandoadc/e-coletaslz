import axios from "axios";

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const apiService = axios.create({
  baseURL: apiUrl,
});

export function isEmpty(obj) { 
    return Object.keys(obj).length === 0; 
} 

export const getBankList = async () => {
    try {
        const response = await apiService.get('/coletors');
        return response.data;
    } catch (error) {
        throw error;
    }
};


// export async function getPixKey(pixKey) {
//     try {
//         const response = (await apiService.get('/pixkeys?filter[where][key]='+pixKey));
//         // console.log(response.data);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };
//
// export async function getAccount(accounts_id) {
//     try {
//         const response = (await apiService.get('/accounts?filter[where][id]='+ accounts_id));
//         // console.log(response.data);
//         return response.data;
//     } catch (error) {
//         throw error;
//   try {
//     const response = await apiService.get("/banks");
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// }
// };

// export async function getTransactionsList(accounts_id) {
//   try {
//     const response = await apiService.get(
//       "/transactions?filter[where][accounts_id]=" + accounts_id
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// }

export const validateAccount = async (
  agencyNumber,
  accountNumber,
  password
) => {
  try {
    const agenciesResponse = await apiService.get("/agencies");
    const agencies = agenciesResponse.data;

    let agency;
    for (let i = 0; i < agencies.length; i++) {
      if (agencies[i].number === agencyNumber) {
        agency = agencies[i];
        break;
      }
    }

    if (!agency) {
      throw new Error("Agência não encontrada");
    }

    const accountsResponse = await apiService.get(
      `/agencies/${agency.id}/accounts`
    );
    const accounts = accountsResponse.data;

    const account = accounts.find(
      (a) =>
        a.number === accountNumber &&
        (password === null || a.password === password)
    );

    if (!account) {
      throw new Error("Conta ou senha incorretas");
    }

    return account;
  } catch (error) {
    throw error;
  }
};

// export const transfer = async (
//   fromAgency,
//   fromAccount,
//   toAgencyNumber,
//   toAccountNumber,
//   value,
//   password
// ) => {
//   try {
//     const fromAccountValidated = await validateAccount(
//       fromAgency,
//       fromAccount,
//       password
//     );
//
//     const toAccount = await validateAccount(
//       toAgencyNumber,
//       toAccountNumber,
//       null
//     );
//
//     if (fromAccountValidated.balance < value) {
//       throw new Error("Saldo insuficiente");
//     }
//
//     const newBalance =
//       parseFloat(fromAccountValidated.balance) - parseFloat(value);
//     await apiService.put(`/accounts/${fromAccountValidated.id}`, {
//       number: fromAccountValidated.number,
//       password: fromAccountValidated.password,
//       balance: newBalance,
//       agencies_id: fromAccountValidated.agencies_id,
//       customers_id: fromAccountValidated.customers_id,
//     });
//
//     const toAccountNewBalance =
//       parseFloat(toAccount.balance) + parseFloat(value);
//     await apiService.put(`/accounts/${toAccount.id}`, {
//       number: toAccount.number,
//       password: toAccount.password,
//       balance: toAccountNewBalance,
//       agencies_id: toAccount.agencies_id,
//       customers_id: toAccount.customers_id,
//     });
//
//     await apiService.post(`/transactions`, {
//       date: new Date().toISOString(),
//       type: "Transferência de saída",
//       amount: parseFloat(-value),
//       description: "NULL",
//       accounts_id: fromAccountValidated.id,
//     });
//
//     await apiService.post(`/transactions`, {
//       date: new Date().toISOString(),
//       type: "Transferência de entrada",
//       amount: parseFloat(value),
//       description: "NULL",
//       accounts_id: toAccount.id,
//     });
//
//     return { message: "Transferência realizada com sucesso" };
//   } catch (error) {
//     throw error;
//   }
// };

export const getCustomers = async () => {
  try {
    const accountData = JSON.parse(sessionStorage.getItem("accountData"));
    const userId = accountData.customers_id;
    const response = await apiService.get(`/customers/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAccounts = async () => {
  try {
    const accountData = JSON.parse(sessionStorage.getItem("accountData"));
    const userId = accountData.id;
    const response = await apiService.get(`/accounts/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAgencies = async () => {
  try {
    const accountData = JSON.parse(sessionStorage.getItem("accountData"));
    const userId = accountData.agencies_id;
    const response = await apiService.get(`/agencies/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
