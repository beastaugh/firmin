{-# LANGUAGE OverloadedStrings #-}
module Main where

import Control.Arrow ((>>>))
import Control.Monad (forM_)

import Hakyll

main :: IO ()
main = hakyll $ do
    -- Compress CSS
    match "css/*.css" $ do
        route   idRoute
        compile compressCssCompiler
    
    -- Read templates
    match "templates/*" $ compile templateCompiler
    
    -- Release archive
    match "downloads/*.js" $ do
        route   idRoute
        compile copyFileCompiler
    
    -- Documentation pages
    forM_ [ "index.md"
          , "changelog.md"
          , "downloads.md"
          , "api.md"
          ] $ \page -> do
        match page $ do
            route   $ setExtension ".html"
            compile $ pageCompiler
                >>> applyTemplateCompiler "templates/default.html"
                >>> relativizeUrlsCompiler
