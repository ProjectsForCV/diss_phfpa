/***********************************************************************
 * Date: 28/01/2018
 * Author: Daniel Cooke
 ***********************************************************************/
/*
 DCOOKE 28/01/2018 - This class can be accessed from anywhere in the program during runtime - it is designed to store
 global variables such as run mode.
 */

export class Globals {
  public static AppRunModeEnum = {
  MOCK: 0,
  PROD: 1
};

  // DCOOKE 28/01/2018 - This is the run mode which determines which endpoitns the application will attempt to call
  public static RunMode = Globals.AppRunModeEnum.PROD;


}
